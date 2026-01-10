import { db } from "@/lib/db";
import { user, vendor } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

// ============================================
// REQUEST VALIDATION SCHEMA
// ============================================

const createVendorProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(200, "Business name is too long")
    .trim(),
  businessLicenseNumber: z
    .string()
    .min(5, "Business license number must be at least 5 characters")
    .max(100, "Business license number is too long")
    .trim(),
  taxId: z
    .string()
    .min(5, "Tax ID must be at least 5 characters")
    .max(50, "Tax ID is too long")
    .trim(),
});

type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>;

// ============================================
// RESPONSE TYPES
// ============================================

interface ApiErrorResponse {
  success: false;
  message: string;
  details?: string | z.ZodIssue[];
}

interface ApiSuccessResponse {
  success: true;
  message: string;
  data: {
    userId: string;
    vendorId: string;
    email: string;
    name: string;
    role: string;
  };
}

// ============================================
// ERROR HANDLER
// ============================================

function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  console.error("Vendor profile creation error:", error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        details: error.message,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    // Check for database constraint violations
    if (error.message.includes("unique constraint") || error.message.includes("duplicate key")) {
      return NextResponse.json(
        {
          success: false,
          message: "A vendor profile already exists for this user",
        },
        { status: 409 }
      );
    }

    // Check for foreign key violations
    if (error.message.includes("foreign key constraint")) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create vendor profile",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "An unexpected error occurred",
    },
    { status: 500 }
  );
}

// ============================================
// MAIN HANDLER
// ============================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
  try {
    // Parse and validate request body
    const body: unknown = await request.json();
    const validatedData: CreateVendorProfileInput = createVendorProfileSchema.parse(body);

    // ============================================
    // AUTHENTICATION CHECK
    // ============================================
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized - Please log in",
        },
        { status: 401 }
      );
    }

    // Verify the userId matches the authenticated user
    if (session.user.id !== validatedData.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden - You can only create your own vendor profile",
        },
        { status: 403 }
      );
    }

    // ============================================
    // CHECK IF USER EXISTS
    // ============================================
    const [existingUser] = await db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, validatedData.userId))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // ============================================
    // CHECK IF ALREADY A VENDOR
    // ============================================
    if (existingUser.role === "vendor") {
      // Check if vendor profile already exists
      const [existingVendor] = await db
        .select({ id: vendor.id })
        .from(vendor)
        .where(eq(vendor.userId, validatedData.userId))
        .limit(1);

      if (existingVendor) {
        return NextResponse.json(
          {
            success: false,
            message: "Vendor profile already exists",
          },
          { status: 409 }
        );
      }
    }

    // ============================================
    // CREATE VENDOR PROFILE
    // ============================================
    // Update user role to vendor
    const [updatedUser] = await db
      .update(user)
      .set({
        role: "vendor",
        updatedAt: new Date(),
      })
      .where(eq(user.id, validatedData.userId))
      .returning({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });

    if (!updatedUser) {
      throw new Error("Failed to update user role");
    }

    // Create vendor profile
    const [newVendor] = await db
      .insert(vendor)
      .values({
        userId: updatedUser.id,
        businessName: validatedData.businessName,
        businessLicenseNumber: validatedData.businessLicenseNumber,
        taxId: validatedData.taxId,
        status: "pending", // Default to pending for admin approval
      })
      .returning({
        id: vendor.id,
        businessName: vendor.businessName,
        status: vendor.status,
      });

    if (!newVendor) {
      throw new Error("Failed to create vendor profile");
    }

    const result = {
      user: updatedUser,
      vendor: newVendor,
    };

    // ============================================
    // SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        success: true,
        message: "Vendor profile created successfully. Awaiting admin approval.",
        data: {
          userId: result.user.id,
          vendorId: result.vendor.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}