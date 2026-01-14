'use client';

import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { ICarCard } from '@/components/CarCard';
import { CheckoutButton } from '@/components/checkout-button';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessLicenseNumber: string;
  taxId: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: string;
  totalEarnings: string;
  bankAccountDetails: unknown;
  approvedAt: Date | null;
  approvedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CheckoutData {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  dailyRate: string;
  weeklyRate: string | null;
  monthlyRate: string | null;
  commissionRate: string;
}

interface Location {
  display_name: string;
  lat: string;
  lon: string;
}

interface BookingFormProps {
  car: ICarCard;
  vendor: Vendor;
}

const SERVICE_FEE = 15.0;

export const BookingForm = ({ car, vendor }: BookingFormProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);

  // Calculate number of days between dates
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [startDate, endDate]);

  // Calculate total rental cost
  const calculateTotal = useMemo(() => {
    if (days === 0) return parseFloat(car.dailyRate);


    if (days >= 30 && car.monthlyRate) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return (
        months * parseFloat(car.monthlyRate) +
        remainingDays * parseFloat(car.dailyRate)
      );
    }

    if (days >= 7 && car.weeklyRate) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return (
        weeks * parseFloat(car.weeklyRate) +
        remainingDays * parseFloat(car.dailyRate)
      );
    }

    return parseFloat(car.dailyRate) * days;
  }, [days, car.dailyRate, car.weeklyRate, car.monthlyRate]);

  const totalWithFees = calculateTotal + SERVICE_FEE;

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return (
      !!startDate &&
      !!endDate &&
      !!pickupLocation &&
      !!dropoffLocation &&
      endDate >= startDate
    );
  }, [startDate, endDate, pickupLocation, dropoffLocation]);

  // Prepare checkout data
  const checkoutData: CheckoutData = {
    carId: car.id,
    startDate: startDate ? format(startDate, 'yyyy-MM-dd') : '',
    endDate: endDate ? format(endDate, 'yyyy-MM-dd') : '',
    pickupLocation: pickupLocation?.display_name || '',
    dropoffLocation: dropoffLocation?.display_name || '',
    dailyRate: car.dailyRate,
    weeklyRate: car.weeklyRate || null,
    monthlyRate: car.monthlyRate || null,
    commissionRate: vendor.commissionRate,
  };

  return (
    <div className="sticky top-6 space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
      {/* Pricing Header */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            ${parseFloat(car.dailyRate).toFixed(2)}
          </span>
          <span className="text-muted-foreground">/day</span>
        </div>
        {car.weeklyRate && car.monthlyRate && (
          <p className="text-sm text-muted-foreground">
            ${parseFloat(car.weeklyRate).toFixed(2)}/week · $
            {parseFloat(car.monthlyRate).toFixed(2)}/month
          </p>
        )}
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Pickup Date */}
        <div className="space-y-2">
          <Label htmlFor="start-date">Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date */}
        <div className="space-y-2">
          <Label htmlFor="end-date">Return Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !endDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (date < today) return true;
                  if (startDate) {
                    return date < startDate;
                  }
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Pickup Location */}
        <LocationAutocomplete
          label="Pickup Location"
          placeholder="Enter pickup address..."
          onChange={(location) => setPickupLocation(location)}
          required
        />

        {/* Dropoff Location */}
        <LocationAutocomplete
          label="Dropoff Location"
          placeholder="Enter dropoff address..."
          onChange={(location) => setDropoffLocation(location)}
          required
        />
      </div>

      {/* Pricing Breakdown */}
      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Base price {days > 0 && `(${days} ${days === 1 ? 'day' : 'days'})`}
          </span>
          <span className="font-medium text-foreground">
            ${calculateTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee</span>
          <span className="font-medium text-foreground">
            ${SERVICE_FEE.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">
            ${totalWithFees.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <CheckoutButton isInstantBooking={car.isInstantBooking} disabled={!isFormValid} {...checkoutData} />
    </div>
  );
};