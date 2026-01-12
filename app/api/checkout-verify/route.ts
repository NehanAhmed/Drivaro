export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/lib/db';
import { booking } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      );
    }

    // Find booking by booking number
    const bookingNumber = session.metadata?.bookingNumber;
    const bookingData = await db
      .select()
      .from(booking)
      .where(eq(booking.bookingNumber, bookingNumber!))
      .limit(1);

    return NextResponse.json({
      status: session.payment_status,
      booking: bookingData[0] || null,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
    });

  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
