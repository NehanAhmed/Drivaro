// components/vendor/dashboard/recent-bookings.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Car, ArrowRight, Clock } from 'lucide-react';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  carName: string;
  carImage: string | null;
  startDate: Date;
  endDate: Date;
  totalAmount: string;
  status: string;
  paymentStatus: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const statusConfig: Record<string, any> = {
    pending: { label: 'Pending', className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' },
    confirmed: { label: 'Confirmed', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
    active: { label: 'Active', className: 'bg-green-500/10 text-green-700 dark:text-green-400' },
    completed: { label: 'Completed', className: 'bg-primary/10 text-primary' },
    cancelled: { label: 'Cancelled', className: 'bg-red-500/10 text-red-700 dark:text-red-400' },
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest rental activities</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-semibold text-muted-foreground">No bookings yet</p>
              <p className="text-sm text-muted-foreground">Your recent bookings will appear here</p>
            </div>
          ) : (
            bookings.map((booking) => {
              const config = statusConfig[booking.status] || statusConfig.pending;
              
              return (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-accent/50 transition-all hover:shadow-sm group"
                >
                  {/* Car Image */}
                  <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
                    {booking.carImage ? (
                      <img 
                        src={booking.carImage} 
                        alt={booking.carName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{booking.customerName}</p>
                      <Badge variant="outline" className={`${config.className} text-xs`}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mb-1">
                      {booking.carName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-primary">
                      ${parseFloat(booking.totalAmount).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.bookingNumber}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}