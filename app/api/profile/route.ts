import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema with all fields optional
const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name must not be empty").max(100, "Name too long").optional(),
  fullName: z.string().trim().min(1, "Full name must not be empty").max(200, "Full name too long").optional(),
  email: z.string().trim().email("Invalid email format").optional(),
  phoneNumber: z.string()
    .trim()
    .regex(/^\+?[\d\s-()]+$/, "Invalid phone number format")
    .min(10, "Phone number too short")
    .max(20, "Phone number too long")
    .optional(),
  profileImageUrl: z.string().trim().url("Invalid image URL").max(500, "URL too long").optional(),
});

// Type inference from schema
type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Response types for better type safety
interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

// Custom error class for better error handling
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * PATCH /api/user/profile
 * Updates user profile information with optional fields
 */
export async function PATCH(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1. Get and verify session
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.session || !session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "You must be authenticated to update your profile" 
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Authorization check - only customers can update profile via this endpoint
    if (await session?.roles === "vendor" || await session?.roles === "admin") {
      return NextResponse.json(
        { 
          success: false,
          error: "Forbidden",
          message: "This endpoint is only available for customer accounts" 
        },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    let body: UpdateProfileInput;
    try {
      const rawBody = await req.json();
      body = updateProfileSchema.parse(rawBody);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false,
            error: "Validation Error",
            message: "Invalid input data",
            details: error.issues.map(err => ({
              field: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // 4. Build update data object with only provided fields
    const updateData: Partial<typeof user.$inferInsert> = {};
    
    if (body.name !== undefined) {
      updateData.name = body.name;
    }
    
    if (body.fullName !== undefined) {
      updateData.fullName = body.fullName;
    }
    
    if (body.email !== undefined) {
      updateData.email = body.email;
    }
    
    if (body.phoneNumber !== undefined) {
      updateData.phoneNumber = body.phoneNumber;
    }
    
    if (body.profileImageUrl !== undefined) {
      updateData.profileImageUrl = body.profileImageUrl;
    }

    // 5. Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Bad Request",
          message: "No valid fields provided for update" 
        },
        { status: 400 }
      );
    }

    // 6. Check for email uniqueness if email is being updated
    if (updateData.email && updateData.email !== session.user.email) {
      const existingUser = await db
        .select({ id: user.id })
        .from(user)
        .where(
          and(
            eq(user.email, updateData.email),
            ne(user.id, userId)
          )
        )
        .limit(1);

      if (existingUser.length > 0) {
        return NextResponse.json(
          { 
            success: false,
            error: "Conflict",
            message: "This email is already in use by another account" 
          },
          { status: 409 }
        );
      }

      // If email is being changed, reset email verification
      updateData.emailVerified = false;
    }

    // 7. Add updatedAt timestamp
    updateData.updatedAt = new Date();

    // 8. Update user in database
    const [updatedUser] = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        profileImageUrl: user.profileImageUrl,
        image: user.image,
        role: user.role,
        isVerified: user.isVerified,
        updatedAt: user.updatedAt,
      });

    if (!updatedUser) {
      throw new APIError(
        "Failed to update user profile",
        500,
        "UPDATE_FAILED"
      );
    }

    // 9. Return success response
    return NextResponse.json(
      { 
        success: true,
        message: "Profile updated successfully",
        data: updatedUser
      },
      { status: 200 }
    );

  } catch (error) {
    // Centralized error handling
    console.error("[USER_PROFILE_UPDATE_ERROR]", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    if (error instanceof APIError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.code || "Internal Server Error",
          message: error.message 
        },
        { status: error.statusCode }
      );
    }

    // Database errors (Neon/Drizzle specific)
    if (error instanceof Error) {
      // Unique constraint violation
      if (error.message.includes("unique") || error.message.includes("duplicate key")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Conflict",
            message: "This value is already in use by another account" 
          },
          { status: 409 }
        );
      }

      // Foreign key constraint violation
      if (error.message.includes("foreign key") || error.message.includes("violates")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Bad Request",
            message: "Invalid reference data" 
          },
          { status: 400 }
        );
      }

      // Connection errors
      if (error.message.includes("connection") || error.message.includes("timeout")) {
        return NextResponse.json(
          { 
            success: false,
            error: "Service Unavailable",
            message: "Database connection error. Please try again later." 
          },
          { status: 503 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later." 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/user/profile
 * Retrieves current user profile information
 */
export async function GET(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1. Get and verify session
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.session || !session?.user) {
      return NextResponse.json(
        { 
          success: false,
          error: "Unauthorized",
          message: "You must be authenticated to view your profile" 
        },
        { status: 401 }
      );
    }

    // 2. Fetch fresh user data from database
    const [userData] = await db
      .select({
        id: user.id,
        name: user.name,
        fullName: user.fullName,
        email: user.email,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        profileImageUrl: user.profileImageUrl,
        image: user.image,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userData) {
      return NextResponse.json(
        { 
          success: false,
          error: "Not Found",
          message: "User profile not found" 
        },
        { status: 404 }
      );
    }

    // 3. Return user data
    return NextResponse.json(
      { 
        success: true,
        message: "Profile retrieved successfully",
        data: userData
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("[USER_PROFILE_GET_ERROR]", {
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });

    // Database connection errors
    if (error instanceof Error && 
        (error.message.includes("connection") || error.message.includes("timeout"))) {
      return NextResponse.json(
        { 
          success: false,
          error: "Service Unavailable",
          message: "Database connection error. Please try again later." 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Internal Server Error",
        message: "An unexpected error occurred. Please try again later." 
      },
      { status: 500 }
    );
  }
}