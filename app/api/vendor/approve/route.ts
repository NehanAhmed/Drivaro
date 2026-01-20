import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { vendor } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get session and verify admin role
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.session?.userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify user is admin
    if (await session.roles !== 'admin') {
      return NextResponse.json(
        { message: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const { vendorId } = await request.json()

    if (!vendorId) {
      return NextResponse.json(
        { message: 'Vendor ID is required' },
        { status: 400 }
      )
    }

    // Update vendor status to approved
    const [updatedVendor] = await db
      .update(vendor)
      .set({
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: session.session.userId,
      })
      .where(eq(vendor.id, vendorId))
      .returning()

    if (!updatedVendor) {
      return NextResponse.json(
        { message: 'Vendor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Vendor approved successfully',
      vendor: updatedVendor,
    })
  } catch (error) {
    console.error('Error approving vendor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}