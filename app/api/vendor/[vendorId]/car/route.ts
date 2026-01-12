import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { car, vendor } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Zod schema for request validation
const createCarSchema = z.object({
    vendorId: z.string().uuid("Invalid vendor ID format"),
    make: z.string().min(1, "Make is required").max(100, "Make is too long"),
    model: z.string().min(1, "Model is required").max(100, "Model is too long"),
    year: z.number().int().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    color: z.string().min(1, "Color is required").max(50, "Color is too long"),
    licensePlate: z.string().min(1, "License plate is required").max(20, "License plate is too long"),
    vinNumber: z.string().min(17, "VIN must be at least 17 characters").max(17, "VIN must be exactly 17 characters"),
    category: z.enum(["economy", "comfort", "luxury", "suv", "sports"]).catch("economy"),
    transmission: z.enum(["automatic", "manual"]).catch("automatic"),
    fuelType: z.enum(["petrol", "diesel", "electric", "hybrid"]).catch("petrol"),
    seats: z.number().int().min(1, "Seats must be at least 1").max(15, "Seats cannot exceed 15"),
    dailyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Daily rate must be a valid decimal").refine(
        (val) => parseFloat(val) > 0,
        "Daily rate must be greater than 0"
    ),
    weeklyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Weekly rate must be a valid decimal").optional().nullable(),
    monthlyRate: z.string().regex(/^\d+(\.\d{1,2})?$/, "Monthly rate must be a valid decimal").optional().nullable(),
    mileageLimitPerDay: z.number().int().min(0, "Mileage limit cannot be negative"),
    extraMileageCost: z.string().regex(/^\d+(\.\d{1,2})?$/, "Extra mileage cost must be a valid decimal").refine(
        (val) => parseFloat(val) >= 0,
        "Extra mileage cost cannot be negative"
    ),
    locationLat: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid latitude").optional().nullable().refine(
        (val) => !val || (parseFloat(val) >= -90 && parseFloat(val) <= 90),
        "Latitude must be between -90 and 90"
    ),
    locationLng: z.string().regex(/^-?\d+(\.\d+)?$/, "Invalid longitude").optional().nullable().refine(
        (val) => !val || (parseFloat(val) >= -180 && parseFloat(val) <= 180),
        "Longitude must be between -180 and 180"
    ),
    locationAddress: z.string().max(500, "Location address is too long").optional().nullable(),
    features: z.array(z.string()).optional().nullable(),
    images: z.array(z.string().url("Each image must be a valid URL")).optional().nullable(),
    isInstantBooking: z.boolean().optional(),
    minimumRentalHours: z.number().int().min(1, "Minimum rental hours must be at least 1").optional(),
});

type CreateCarInput = z.infer<typeof createCarSchema>;

interface ApiErrorResponse {
    error: string;
    details?: string | z.ZodIssue[];
}

interface ApiSuccessResponse {
    success: boolean;
    data: {
        id: string;
        slug: string;
        message: string;
    };
}

interface GetCarsSuccessResponse {
    success: boolean;
    data: any[];
}

// Helper function to generate slug
function generateSlug(make: string, model: string, year: number, licensePlate: string): string {
    const baseSlug = `${make}-${model}-${year}`.toLowerCase().replace(/\s+/g, "-");
    const uniquePart = licensePlate.slice(-4).toLowerCase();
    return `${baseSlug}-${uniquePart}`;
}

// Helper function to handle errors
function handleError(error: unknown): NextResponse<ApiErrorResponse> {
    console.error("API error:", error);

    if (error instanceof z.ZodError) {
        return NextResponse.json(
            {
                error: "Validation failed",
                details: error.errors,
            },
            { status: 400 }
        );
    }

    if (error instanceof Error) {
        // Check for database constraint violations
        if (error.message.includes("unique constraint") || error.message.includes("duplicate key")) {
            if (error.message.includes("license_plate")) {
                return NextResponse.json(
                    { error: "License plate already exists" },
                    { status: 409 }
                );
            }
            if (error.message.includes("slug")) {
                return NextResponse.json(
                    { error: "Car slug already exists" },
                    { status: 409 }
                );
            }
            return NextResponse.json(
                { error: "A car with these details already exists" },
                { status: 409 }
            );
        }

        // Check for foreign key violations
        if (error.message.includes("foreign key constraint")) {
            return NextResponse.json(
                { error: "Vendor not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                error: "Failed to process request",
                details: error.message,
            },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
    );
}

/**
 * POST /api/vendor/[vendorId]/car
 * Create a new car for a vendor
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiSuccessResponse | ApiErrorResponse>> {
    try {
        // Parse and validate request body
        const body: unknown = await request.json();
        const validatedData: CreateCarInput = createCarSchema.parse(body);

        // Verify vendor exists
        const [existingVendor] = await db
            .select({ id: vendor.id })
            .from(vendor)
            .where(eq(vendor.id, validatedData.vendorId))
            .limit(1);

        if (!existingVendor) {
            return NextResponse.json(
                { error: "Vendor not found" },
                { status: 404 }
            );
        }

        // Check if license plate already exists
        const [existingCar] = await db
            .select({ id: car.id })
            .from(car)
            .where(eq(car.licensePlate, validatedData.licensePlate))
            .limit(1);

        if (existingCar) {
            return NextResponse.json(
                { error: "License plate already exists" },
                { status: 409 }
            );
        }

        // Generate slug
        const slug = generateSlug(
            validatedData.make,
            validatedData.model,
            validatedData.year,
            validatedData.licensePlate
        );

        // Insert car into database
        const [newCar] = await db
            .insert(car)
            .values({
                vendorId: validatedData.vendorId,
                slug,
                make: validatedData.make,
                model: validatedData.model,
                year: validatedData.year,
                color: validatedData.color,
                licensePlate: validatedData.licensePlate,
                vinNumber: validatedData.vinNumber,
                category: validatedData.category,
                transmission: validatedData.transmission,
                fuelType: validatedData.fuelType,
                seats: validatedData.seats,
                dailyRate: validatedData.dailyRate,
                weeklyRate: validatedData.weeklyRate || null,
                monthlyRate: validatedData.monthlyRate || null,
                mileageLimitPerDay: validatedData.mileageLimitPerDay,
                extraMileageCost: validatedData.extraMileageCost,
                locationLat: validatedData.locationLat || null,
                locationLng: validatedData.locationLng || null,
                locationAddress: validatedData.locationAddress || null,
                status: "available",
                features: validatedData.features || null,
                images: validatedData.images || null,
                isInstantBooking: validatedData.isInstantBooking ?? false,
                minimumRentalHours: validatedData.minimumRentalHours ?? 24,
            })
            .returning();

        if (!newCar) {
            throw new Error("Failed to create car - no data returned");
        }

        return NextResponse.json(
            {
                success: true,
                data: {
                    id: newCar.id,
                    slug: newCar.slug,
                    message: "Car created successfully",
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/vendor/[vendorId]/car
 * Retrieve all cars for a specific vendor
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ vendorId: string }> }
): Promise<NextResponse<GetCarsSuccessResponse | ApiErrorResponse>> {
    try {
        const { vendorId } = await params;

        // Validate vendorId format
        if (!vendorId || typeof vendorId !== 'string') {
            return NextResponse.json(
                { error: "Vendor ID is required" },
                { status: 400 }
            );
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(vendorId)) {
            return NextResponse.json(
                { error: "Invalid vendor ID format" },
                { status: 400 }
            );
        }

        // Verify vendor exists
        const [vendorExists] = await db
            .select({ id: vendor.id })
            .from(vendor)
            .where(eq(vendor.id, vendorId))
            .limit(1);

        if (!vendorExists) {
            return NextResponse.json(
                { error: "Vendor not found" },
                { status: 404 }
            );
        }

        // Fetch all cars for the vendor
        const cars = await db
            .select()
            .from(car)
            .where(eq(car.vendorId, vendorId));

        return NextResponse.json(
            { 
                success: true, 
                data: cars 
            }, 
            { status: 200 }
        );
    } catch (error) {
        return handleError(error);
    }
}