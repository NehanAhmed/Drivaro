import { db } from "@/lib/db";
import { car } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // CRITICAL: DO NOT use [cars] - remove the brackets!
        const cars = await db
            .select()
            .from(car)

        console.log('Cars from DB:', cars.length, 'cars')

        return NextResponse.json({ 
            success: true,
            message: "Cars Fetched Successfully", 
            data: cars  // This should be an array
        }, { status: 200 })
    } catch (error) {
        console.error('Error fetching cars:', error)
        return NextResponse.json({ 
            success: false,
            message: 'Error Fetching Cars' 
        }, { status: 500 })
    }
}