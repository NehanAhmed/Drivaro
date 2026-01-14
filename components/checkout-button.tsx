'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { calculateBookingPrice } from '@/lib/pricing';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CheckoutButtonProps {
  carId: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  disabled?: boolean;
  dailyRate: string;
  weeklyRate: string | undefined | null;
  monthlyRate: string | undefined | null;
  commissionRate: string | undefined | null;
}

export function CheckoutButton({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalAmount = calculateBookingPrice(
    Number(dailyRate),
    weeklyRate ? Number(weeklyRate) : null,
    monthlyRate ? Number(monthlyRate) : null,
    new Date(startDate),
    new Date(endDate),
    Number(commissionRate)
  );
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionData } = await authClient.getSession()

      const costumerId = sessionData?.session.userId || sessionData?.user.id

      if (!costumerId) {
        toast.error("You must be Authenticated to Make a Purchase.")
        setTimeout(() => {
          router.push('/register')
        }, 2000);
        setLoading(false)
        setError("You Must be Authenticated to Make a Purchase.")
        return
      }
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carId,
          costumerId,
          startDate,
          endDate,
          pickupLocation,
          dropoffLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Redirect to Stripe Checkout
      if (!data.url) {
        throw new Error('No checkout URL provided');
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={loading || disabled}
        className="w-full"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${totalAmount}`
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}