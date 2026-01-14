import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { calculateBookingPrice } from '@/lib/pricing';
import { db } from '@/lib/db';
import { car, vendor } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

// Request body validation
interface CheckoutRequestBody {
  carId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
}

// Response types
interface CheckoutSuccessResponse {
  sessionId: string;
  url: string;
  bookingNumber: string;
}

interface CheckoutErrorResponse {
  error: string;
  details?: string;
}

// Validate request body
function validateRequestBody(body: Partial<CheckoutRequestBody>): body is CheckoutRequestBody {
  return !!(
    body.carId &&
    body.customerId &&
    body.startDate &&
    body.endDate &&
    body.pickupLocation &&
    body.dropoffLocation
  );
}

// Generate unique booking number
function generateBookingNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `BK-${timestamp}-${random}`;
}

// Retry Stripe API calls with exponential backoff
async function retryStripeCall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof Stripe.errors.StripeInvalidRequestError) {
        throw error;
      }

      // Only retry on connection/network errors
      const isNetworkError = 
        error instanceof Stripe.errors.StripeConnectionError ||
        (error as Error).message?.includes('ENOTFOUND') ||
        (error as Error).message?.includes('EAI_AGAIN') ||
        (error as Error).message?.includes('ETIMEDOUT');

      if (!isNetworkError || attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Stripe API call failed (attempt ${attempt + 1}/${maxRetries}), retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest): Promise<NextResponse<CheckoutSuccessResponse | CheckoutErrorResponse>> {
  try {
    // Parse and validate request body
    const body = await req.json();

    if (!validateRequestBody(body)) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'carId, customerId, startDate, endDate, pickupLocation, and dropoffLocation are required'
        },
        { status: 400 }
      );
    }

    const {
      carId,
      customerId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
    } = body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Fetch car and vendor details
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

    // Verify car is available
    if (carData.status !== 'available') {
      return NextResponse.json(
        { error: 'Car is not available for booking' },
        { status: 400 }
      );
    }

    // Calculate pricing
    const pricing = calculateBookingPrice(
      Number(carData.dailyRate),
      carData.weeklyRate ? Number(carData.weeklyRate) : null,
      carData.monthlyRate ? Number(carData.monthlyRate) : null,
      start,
      end,
      Number(vendorData.commissionRate)
    );

    // Validate pricing
    if (pricing.totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid pricing calculation' },
        { status: 400 }
      );
    }

    // Generate booking number
    const bookingNumber = generateBookingNumber();

    // Get first image or use placeholder
    const carImages = carData.images as string[] | null;
    const imageUrl = carImages && carImages.length > 0 ? carImages[0] : undefined;

    // Prepare session metadata
    const metadata: Record<string, string> = {
      bookingNumber,
      carId,
      customerId,
      vendorId: vendorData.id,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      pickupLocation,
      dropoffLocation,
      totalDays: pricing.totalDays.toString(),
      basePrice: pricing.basePrice.toFixed(2),
      discount: pricing.discount.toFixed(2),
      tax: pricing.tax.toFixed(2),
      commission: pricing.commission.toFixed(2),
      depositAmount: pricing.depositAmount.toFixed(2),
      totalAmount: pricing.totalAmount.toFixed(2),
    };

    // Verify environment variables
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error('NEXT_PUBLIC_BASE_URL is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session with retry logic
    const session = await retryStripeCall(async () => {
      return await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${carData.make} ${carData.model} (${carData.year})`,
                description: `${pricing.totalDays} day rental: ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
                images: imageUrl ? [imageUrl] : undefined,
              },
              unit_amount: Math.round(pricing.totalAmount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],

        metadata,

        // Redirect URLs
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel?car_id=${carId}`,

        // Payment settings
        payment_intent_data: {
          capture_method: 'automatic',
          metadata: {
            bookingNumber,
            type: 'car_rental',
          },
        },

        // Session settings
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
      }, {
        timeout: 15000, // 15 second timeout
        maxNetworkRetries: 2, // Stripe SDK will retry 2 times
      });
    }, 3); // Our custom retry wrapper will retry 3 times

    return NextResponse.json({
      sessionId: session.id,
      url: session.url || '',
      bookingNumber,
    });

  } catch (error) {
    console.error('Checkout error:', error);

    // Handle specific error types
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return NextResponse.json(
        { 
          error: 'Invalid request to payment provider',
          details: error.message 
        },
        { status: 400 }
      );
    }

    if (error instanceof Stripe.errors.StripeConnectionError) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to payment provider',
          details: 'Please check your internet connection and try again' 
        },
        { status: 503 }
      );
    }

    if (error instanceof Stripe.errors.StripeAPIError) {
      return NextResponse.json(
        { 
          error: 'Payment provider error',
          details: 'Please try again later' 
        },
        { status: 502 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}