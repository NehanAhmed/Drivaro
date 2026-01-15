import { Booking, BookingGrid } from '@/components/booking/booking-grid'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { booking, car } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.session) {
    redirect('/login')
  }
  
  // Check if user is vendor
  if (await session.roles === 'vendor') {
    redirect('/')
  }

  // Fetch bookings with car details using JOIN
  const rawBookings = await db
    .select({
      // Booking fields
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId,
      carId: booking.carId,
      vendorId: booking.vendorId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      totalDays: booking.totalDays,
      basePrice: booking.basePrice,
      extraCharges: booking.extraCharges,
      discount: booking.discount,
      tax: booking.tax,
      commission: booking.commission,
      totalAmount: booking.totalAmount,
      depositAmount: booking.depositAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentIntentId: booking.paymentIntentId,
      cancellationReason: booking.cancellationReason,
      cancelledAt: booking.cancelledAt,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      // Car fields
      carMake: car.make,
      carModel: car.model,
      carYear: car.year,
    })
    .from(booking)
    .innerJoin(car, eq(booking.carId, car.id))
    .where(eq(booking.customerId, session.session.userId))
    .orderBy(booking.createdAt)

  // Transform to match Booking interface
  const bookings: Booking[] = rawBookings.map((b) => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    customerId: b.customerId,
    carId: b.carId,
    vendorId: b.vendorId,
    startDate: b.startDate,
    endDate: b.endDate,
    pickupLocation: b.pickupLocation,
    dropoffLocation: b.dropoffLocation,
    totalDays: b.totalDays,
    basePrice: b.basePrice,
    extraCharges: b.extraCharges,
    discount: b.discount,
    tax: b.tax,
    commission: b.commission,
    totalAmount: b.totalAmount,
    depositAmount: b.depositAmount,
    status: b.status as any, // Type assertion for enum
    paymentStatus: b.paymentStatus as any, // Type assertion for enum
    paymentIntentId: b.paymentIntentId,
    cancellationReason: b.cancellationReason,
    cancelledAt: b.cancelledAt,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    carDetails: {
      make: b.carMake,
      model: b.carModel,
      year: b.carYear,
    },
  }))

  return (
    <main>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">
              Your Bookings
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Track and manage all your car rental reservations in one place. 
            </p>
          </div>

          {/* Booking Grid */}
          {bookings.length > 0 ? (
            <BookingGrid bookings={bookings} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No bookings found. Start exploring cars to make your first reservation!
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Page