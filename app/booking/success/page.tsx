'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout-verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
          } else {
            setBooking(data);
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to verify payment');
          setLoading(false);
        });
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        
        <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
        
        <p className="text-gray-600 mb-8">
          Your payment was successful. We've sent a confirmation email to{' '}
          <strong>{booking?.customerEmail}</strong>
        </p>

        {booking?.booking && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <p className="text-sm text-gray-600 mb-2">Booking Number</p>
            <p className="text-2xl font-bold mb-4">
              {booking.booking.bookingNumber}
            </p>
            
            <p className="text-sm text-gray-600">
              Please save this number for your records
            </p>
          </div>
        )}

        <div className="space-x-4">
          <Link
            href="/bookings"
          >
            <Button>

            View My Bookings
            </Button>
          </Link>
          
          <Link
            href="/"
          >
            <Button>
                
            Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}