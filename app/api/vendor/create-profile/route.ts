import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // Import your auth instance

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { userId } = body;

        // Validate userId
        if (!userId || typeof userId !== 'string') {
            return NextResponse.json(
                { message: "Valid user ID is required" }, 
                { status: 400 }
            );
        }

        // Optional: Verify the request is authenticated
        // This ensures only authenticated users can update their own profile
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user) {
            return NextResponse.json(
                { message: "Unauthorized" }, 
                { status: 401 }
            );
        }

        // Verify the userId matches the authenticated user
        if (session.user.id !== userId) {
            return NextResponse.json(
                { message: "Forbidden: Cannot update another user's profile" }, 
                { status: 403 }
            );
        }

        // Check if user exists before updating
        const existingUser = await db
            .select()
            .from(user)
            .where(eq(user.id, userId))
            .limit(1);

        if (!existingUser || existingUser.length === 0) {
            return NextResponse.json(
                { message: "User not found" }, 
                { status: 404 }
            );
        }

        // Check if user is already a vendor
        if (existingUser[0].role === 'vendor') {
            return NextResponse.json(
                { message: "User is already a vendor", user: existingUser[0] }, 
                { status: 200 }
            );
        }

        // Update user role to vendor
        const [updatedUser] = await db
            .update(user)
            .set({ 
                role: 'vendor',
                updatedAt: new Date() // Add updated timestamp if your schema has it
            })
            .where(eq(user.id, userId))
            .returning();

        if (!updatedUser) {
            return NextResponse.json(
                { message: "Failed to update user role" }, 
                { status: 500 }
            );
        }
        
        return NextResponse.json(
            { 
                message: "Vendor profile created successfully", 
                user: {
                    id: updatedUser.id,
                    email: updatedUser.email,
                    name: updatedUser.name,
                    role: updatedUser.role
                }
            }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Error creating vendor profile:", error);
        
        return NextResponse.json(
            { 
                message: "Internal server error",
                error: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }, 
            { status: 500 }
        );
    }
}