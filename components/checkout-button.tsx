'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { calculateBookingPrice } from '@/lib/pricing';

interface CheckoutButtonProps {
  isInstantBooking?: boolean;
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  dailyRate: string;
  weeklyRate?: string | null;
  monthlyRate?: string | null;
  commissionRate?: string | null;
  disabled?: boolean;
}

interface CheckoutResponse {
  url?: string;
  error?: string;
  sessionId?: string;
}

interface SessionData {
  session: {
    userId: string;
  };
  user: {
    id: string;
  };
}

export function CheckoutButton({
  isInstantBooking = false,
  carId,
  startDate,
  endDate,
  pickupLocation,
  dropoffLocation,
  dailyRate,
  weeklyRate,
  monthlyRate,
  commissionRate,
  disabled = false,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Calculate total amount
  const totalAmount = calculateBookingPrice(
    Number(dailyRate),
    weeklyRate ? Number(weeklyRate) : null,
    monthlyRate ? Number(monthlyRate) : null,
    new Date(startDate),
    new Date(endDate),
    Number(commissionRate)
  );

  // Get authenticated user ID
  const getCustomerId = async (): Promise<string | null> => {
    try {
      const { data: sessionData } = await authClient.getSession();
      
      if (!sessionData) {
        return null;
      }

      const typedSessionData = sessionData as SessionData;
      return typedSessionData?.session?.userId || typedSessionData?.user?.id || null;
    } catch (err) {
      console.error('Error getting session:', err);
      return null;
    }
  };

  // Handle checkout process
  const handleCheckout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Verify authentication
      const customerId = await getCustomerId();

      if (!customerId) {
        toast.error('You must be authenticated to make a purchase.');
        setError('Authentication required');
        
        // Redirect to register after delay
        setTimeout(() => {
          router.push('/register');
        }, 2000);
        
        setLoading(false);
        return;
      }

      // Validate booking data
      if (!carId || !startDate || !endDate || !pickupLocation || !dropoffLocation) {
        throw new Error('Missing required booking information');
      }

      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          customerId,
          startDate,
          endDate,
          pickupLocation,
          dropoffLocation,
        }),
      });

      // Parse response
      const data: CheckoutResponse = await response.json();

      // Handle API errors
      if (!response.ok) {
        const errorMessage = data.error || `Checkout failed: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Validate checkout URL
      if (!data.url) {
        throw new Error('No checkout URL provided by server');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  }, [
    carId,
    startDate,
    endDate,
    pickupLocation,
    dropoffLocation,
    router,
  ]);

  // Determine if button should be disabled
  const isButtonDisabled = loading || disabled || !startDate || !endDate || !pickupLocation || !dropoffLocation;

  // Button text
  const buttonText = loading
    ? 'Processing...'
    : !isInstantBooking
    ? 'Request Booking'
    : `Pay ${totalAmount.totalAmount.toFixed(2)}`;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={isButtonDisabled}
        className="w-full"
        size="lg"
        type="button"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {buttonText}
      </Button>

      {error && (
        <p className="text-sm text-destructive text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}