'use client'
import { ICarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Booking Form Component (Client)
export const BookingForm = ({ car }: { car:ICarCard }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [days, setDays] = useState(0);

  const calculateTotal = () => {
    if (days === 0) return car.dailyRate;
    if (days >= 30 && car.monthlyRate) return car.monthlyRate;
    if (days >= 7 && car.weeklyRate) return car.weeklyRate;
    return (parseFloat(car.dailyRate) * days).toFixed(2);
  };

  return (
    <div className="sticky top-6 space-y-6 rounded-2xl border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">${car.dailyRate}</span>
          <span className="text-muted-foreground">/day</span>
        </div>
        {car.weeklyRate && (
          <p className="text-sm text-muted-foreground">
            ${car.weeklyRate}/week · ${car.monthlyRate}/month
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Pickup Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-ring focus:border-ring focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Return Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors hover:border-ring focus:border-ring focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Base price</span>
          <span className="font-medium">${calculateTotal()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service fee</span>
          <span className="font-medium">$15.00</span>
        </div>
        <div className="flex justify-between border-t pt-3">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">${(parseFloat(calculateTotal()) + 15).toFixed(2)}</span>
        </div>
      </div>

      <Button className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
        {car.isInstantBooking ? 'Book Instantly' : 'Request to Book'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won't be charged yet
      </p>
    </div>
  );
};