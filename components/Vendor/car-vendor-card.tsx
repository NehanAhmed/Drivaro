'use client';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  IconEdit,
  IconChartBar,
  IconCar,
  IconManualGearbox,
  IconAutomaticGearbox,
  IconGasStation,
  IconUsers,
  IconClock,
  IconCalendar,
  IconMapPin,
  IconEye,
  IconSettings
} from '@tabler/icons-react';

export interface IVendorCarCard {
  id: string;
  slug: string;
  vendorId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  mileageLimitPerDay: number;
  locationAddress?: string;
  status: 'available' | 'rented' | 'maintenance' | 'inactive';
  images?: string[];
  isInstantBooking: boolean;
  minimumRentalHours: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Vendor-specific props (optional - you can pass these)
  totalBookings?: number;
  currentBooking?: {
    customerName: string;
    endDate: Date | string;
  };
  totalEarnings?: number;
  averageRating?: number;
}

const VendorCarCard = ({ car }: { car: IVendorCarCard }) => {
  const MotionCard = motion.create(Card);

  const statusConfig = {
    available: { label: 'Available', className: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' },
    rented: { label: 'Currently Rented', className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' },
    maintenance: { label: 'Maintenance', className: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20' },
    inactive: { label: 'Inactive', className: 'bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20' }
  };

  const status = statusConfig[car.status];

  return (
    <MotionCard layoutId={car.id} className="w-full overflow-hidden border-border/50 hover:border-border transition-colors">
      <CardHeader className="p-0 relative">
        {/* Image Container */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
          <img
            src={car.images?.[0] || '/default-car-image.jpg'}
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          
          {/* Status Badge - Top Left */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>

          {/* Instant Booking Badge - Top Right */}
          {car.isInstantBooking && (
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Instant Book
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Header Section */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {car.make} {car.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                {car.year} • {car.color} • {car.licensePlate}
              </p>
            </div>
          </div>
          
          {/* Pricing */}
          <div className="pt-1">
            <p className="text-2xl font-semibold">
              ${car.dailyRate}
              <span className="text-sm font-normal text-muted-foreground ml-1">/day</span>
            </p>
            {car.weeklyRate && (
              <p className="text-xs text-muted-foreground">
                ${car.weeklyRate}/week • ${car.monthlyRate}/month
              </p>
            )}
          </div>
        </div>

        {/* Current Booking Info (if rented) */}
        {car.status === 'rented' && car.currentBooking && (
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Current Renter</p>
            <p className="text-sm font-medium">{car.currentBooking.customerName}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Returns: {new Date(car.currentBooking.endDate).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Car Specs Grid */}
        <div className="grid grid-cols-4 gap-3 py-2">
          <div className="flex flex-col items-center gap-1 text-center">
            {car.transmission === 'automatic' ? (
              <IconAutomaticGearbox className="w-5 h-5 text-muted-foreground" />
            ) : (
              <IconManualGearbox className="w-5 h-5 text-muted-foreground" />
            )}
            <p className="text-xs text-muted-foreground capitalize">{car.transmission}</p>
          </div>
          
          <div className="flex flex-col items-center gap-1 text-center">
            <IconGasStation className="w-5 h-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground capitalize">{car.fuelType}</p>
          </div>
          
          <div className="flex flex-col items-center gap-1 text-center">
            <IconUsers className="w-5 h-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{car.seats} seats</p>
          </div>
          
          <div className="flex flex-col items-center gap-1 text-center">
            <IconClock className="w-5 h-5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">{car.minimumRentalHours}h min</p>
          </div>
        </div>

        {/* Stats Row (if provided) */}
        {(car.totalBookings !== undefined || car.totalEarnings !== undefined) && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
            {car.totalBookings !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">Total Bookings</p>
                <p className="text-lg font-semibold">{car.totalBookings}</p>
              </div>
            )}
            {car.totalEarnings !== undefined && (
              <div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="text-lg font-semibold">${car.totalEarnings.toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
        {/* Action Buttons */}
        <div className="w-full flex gap-2 pt-2">
          <Link href={`/vendor/dashboard/vehicles/${car.id}`} className='w-full'>
            <Button variant="outline" className='w-full'>
              <IconEye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default VendorCarCard;