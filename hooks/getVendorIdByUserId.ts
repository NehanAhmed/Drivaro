import { db } from "@/lib/db"
import { vendor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * Retrieves the vendor ID associated with a given user ID
 * @param userId - The user ID to look up
 * @returns The vendor ID string if found, null otherwise
 * @throws Error if userId is invalid
 */
export async function getVendorIdByUserId(userId: string): Promise<string | null> {
    try {
        // Validation: Check if userId is provided
        if (!userId) {
            console.error("getVendorIdByUserId: User ID is required")
            throw new Error("User ID is required")
        }

        // Validation: Check if userId is a string
        if (typeof userId !== 'string') {
            console.error("getVendorIdByUserId: Invalid user ID type")
            throw new Error("User ID must be a string")
        }

        // Validation: Check if userId is not empty after trimming
        const trimmedUserId = userId.trim()
        if (trimmedUserId.length === 0) {
            console.error("getVendorIdByUserId: User ID cannot be empty")
            throw new Error("User ID cannot be empty")
        }

        // Query database for vendor
        const [vendorRecord] = await db
            .select({ id: vendor.id })
            .from(vendor)
            .where(eq(vendor.userId, trimmedUserId))
            .limit(1)

        // Return vendor ID if found, null otherwise
        if (!vendorRecord) {
            console.warn(`getVendorIdByUserId: No vendor found for userId: ${trimmedUserId}`)
            return null
        }

        return vendorRecord.id
    } catch (error) {
        console.error("getVendorIdByUserId: Error occurred", error)
        
        // Re-throw validation errors
        if (error instanceof Error && error.message.includes("required")) {
            throw error
        }
        
        // Return null for database errors to allow graceful handling
        return null
    }
}