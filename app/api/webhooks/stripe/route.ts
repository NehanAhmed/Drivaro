import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { db } from '@/lib/db';
import { booking, transaction, vendor, availabilityBlock } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Create booking in database
      const metadata = session.metadata!;
      
      const [newBooking] = await db.insert(booking).values({
        bookingNumber: metadata.bookingNumber,
        customerId: metadata.customerId,
        carId: metadata.carId,
        vendorId: metadata.vendorId,
        startDate: new Date(metadata.startDate),
        endDate: new Date(metadata.endDate),
        pickupLocation: metadata.pickupLocation,
        dropoffLocation: metadata.dropoffLocation,
        totalDays: parseInt(metadata.totalDays),
        basePrice: metadata.basePrice,
        discount: metadata.discount,
        tax: metadata.tax,
        commission: metadata.commission,
        totalAmount: metadata.totalAmount,
        depositAmount: metadata.depositAmount,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentIntentId: session.payment_intent as string,
      }).returning();

      // Create availability block
      await db.insert(availabilityBlock).values({
        carId: metadata.carId,
        startDate: new Date(metadata.startDate),
        endDate: new Date(metadata.endDate),
        reason: 'booked',
        bookingId: newBooking.id,
      });

      // Create transaction record
      await db.insert(transaction).values({
        bookingId: newBooking.id,
        userId: metadata.customerId,
        type: 'payment',
        amount: metadata.totalAmount,
        status: 'completed',
        paymentMethod: 'card',
        transactionReference: session.payment_intent as string,
      });

      console.log('Booking created:', newBooking.bookingNumber);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('Payment failed:', paymentIntent.id);
      
      // Update booking status
      await db
        .update(booking)
        .set({ paymentStatus: 'pending', status: 'cancelled' })
        .where(eq(booking.paymentIntentId, paymentIntent.id));
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}