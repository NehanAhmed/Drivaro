// components/admin/recent-bookings.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';

interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  carMake: string;
  carModel: string;
  status: string;
  totalAmount: string;
  startDate: string;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

const statusConfig = {
  confirmed: { label: 'Confirmed', variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
  active: { label: 'Active', variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
  pending: { label: 'Pending', variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
  completed: { label: 'Completed', variant: 'secondary' as const, icon: CheckCircle2, color: 'text-green-600' },
  cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
};

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity on your platform</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bookings.map((booking) => {
            const config = statusConfig[booking.status as keyof typeof statusConfig];
            const StatusIcon = config.icon;

            return (
              <div
                key={booking.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-accent/50 transition-all hover:shadow-sm group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-full ${config.color} bg-current/10`}>
                    <StatusIcon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{booking.customerName}</p>
                      <Badge variant={config.variant} className="text-xs">
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {booking.carMake} {booking.carModel} • {booking.bookingNumber}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Start: {new Date(booking.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-lg">${booking.totalAmount}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}