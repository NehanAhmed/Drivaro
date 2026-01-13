import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { calculateBookingPrice } from '@/lib/pricing';
import { db } from '@/lib/db';
import { car, vendor, booking } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      carId,
      customerId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
    } = body;

    // Validate required fields
    if (!carId || !customerId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch car details
    const carDetails = await db
      .select({
        car: car,
        vendor: vendor,
      })
      .from(car)
      .innerJoin(vendor, eq(car.vendorId, vendor.id))
      .where(eq(car.id, carId))
      .limit(1);

    if (!carDetails.length) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    const { car: carData, vendor: vendorData } = carDetails[0];

    // Calculate pricing
    const pricing = calculateBookingPrice(
      Number(carData.dailyRate),
      carData.weeklyRate ? Number(carData.weeklyRate) : null,
      carData.monthlyRate ? Number(carData.monthlyRate) : null,
      new Date(startDate),
      new Date(endDate),
      Number(vendorData.commissionRate)
    );

    // Generate unique booking number
    const bookingNumber = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${carData.make} ${carData.model} - Rental`,
              description: `${pricing.totalDays} day(s) rental from ${startDate} to ${endDate}`,
              images: carData.images ? [(carData.images as string[])[0]] : [],
            },
            unit_amount: Math.round(pricing.totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],

      // Store metadata for webhook processing
      metadata: {
        bookingNumber,
        carId,
        customerId,
        vendorId: vendorData.id,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        totalDays: pricing.totalDays.toString(),
        basePrice: pricing.basePrice.toString(),
        discount: pricing.discount.toString(),
        tax: pricing.tax.toString(),
        commission: pricing.commission.toString(),
        depositAmount: pricing.depositAmount.toString(),
        totalAmount: pricing.totalAmount.toString(),
      },

      // Redirect URLs
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel?car_id=${carId}`,

      // Optional: Collect customer details
      customer_email: undefined, // Add customer email if available
      
      // Payment intent data for authorization holds (deposit)
      payment_intent_data: {
        capture_method: 'automatic', // Can be 'manual' for holds
        metadata: {
          bookingNumber,
          type: 'car_rental',
        },
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      bookingNumber,
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}