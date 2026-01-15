import { IconCalendarEvent, IconCar, IconClock, IconMapPin } from "@tabler/icons-react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"

/* ============================
   Types
============================ */

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"

interface CarDetails {
  make: string
  model: string
  year: number
}

export interface Booking {
  id: string
  bookingNumber: string

  customerId: string
  carId: string
  vendorId: string

  startDate: Date | string
  endDate: Date | string

  pickupLocation: string
  dropoffLocation: string

  totalDays: number

  /** DECIMAL → string to avoid float precision issues */
  basePrice: string
  extraCharges: string
  discount: string
  tax: string
  commission: string
  totalAmount: string
  depositAmount: string

  status: BookingStatus
  paymentStatus: PaymentStatus

  paymentIntentId?: string | null
  cancellationReason?: string | null
  cancelledAt?: Date | string | null

  createdAt: Date | string
  updatedAt?: Date | string | null

  /** Hydrated from JOIN / API */
  carDetails: CarDetails
}

interface BookingGridProps {
  bookings: Booking[]
}

/* ============================
   Component
============================ */

export function BookingGrid({ bookings }: BookingGridProps) {
  const getStatusColor = (status: BookingStatus): string => {
    const colors: Record<BookingStatus, string> = {
      pending: "bg-muted text-muted-foreground",
      confirmed: "bg-primary text-primary-foreground",
      completed: "bg-secondary text-secondary-foreground",
      cancelled: "bg-destructive text-destructive-foreground",
    }

    return colors[status]
  }

  const getPaymentStatusColor = (status: PaymentStatus): string => {
    const colors: Record<PaymentStatus, string> = {
      pending: "bg-muted text-muted-foreground",
      paid: "bg-primary text-primary-foreground",
      failed: "bg-destructive text-destructive-foreground",
      refunded: "bg-secondary text-secondary-foreground",
    }

    return colors[status]
  }

  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatAmount = (amount: string): string => {
    return `PKR ${Number(amount).toLocaleString()}`
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="overflow-hidden border-border hover:border-primary/50 transition-colors"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <IconCar className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-semibold text-foreground">
                        {booking.carDetails.make}{" "}
                        {booking.carDetails.model}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        ({booking.carDetails.year})
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {booking.bookingNumber}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={getStatusColor(booking.status)}
                    >
                      {booking.status}
                    </Badge>

                    <Badge
                      variant="outline"
                      className={getPaymentStatusColor(
                        booking.paymentStatus
                      )}
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Date & Duration */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <IconCalendarEvent className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">
                      {formatDate(booking.startDate)}
                    </span>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-foreground">
                      {formatDate(booking.endDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconClock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {booking.totalDays} days
                    </span>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-4 text-sm">
                  <div className="flex items-start gap-2 flex-1">
                    <IconMapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-foreground">
                        <span className="text-muted-foreground">
                          Pickup:
                        </span>{" "}
                        {booking.pickupLocation}
                      </p>
                      <p className="text-foreground">
                        <span className="text-muted-foreground">
                          Drop-off:
                        </span>{" "}
                        {booking.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {formatAmount(booking.totalAmount)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total Amount
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}