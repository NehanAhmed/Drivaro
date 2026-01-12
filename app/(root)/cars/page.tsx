

import SearchFilter from '@/components/Cars/Search-Filter';
import CarsGrid from '@/components/Cars/CarsGrid';
import { Suspense } from 'react';
import { IconLoader2 } from '@tabler/icons-react';

interface Car {
  id: string
  make: string
  model: string
  year: number
  color: string
  category: string
  transmission: string
  fuelType: string
  seats: number
  dailyRate: number
  locationAddress: string
  status: 'available' | 'rented'
  features: string[]
  images: string[]
  isInstantBooking: boolean
}

const CarsShowcasePage = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/car`,
    {
      cache: 'force-cache', // Cache for better performance
      next: { revalidate: 3600 } // Revalidate every hour
    }
  )

  if (!response.ok) {
    console.error('Failed to fetch cars:', response.status)
    throw new Error("An Error Occurred while fetching Cars.")
  }

  const data = await response.json()

  console.log('API Response:', data)

  // Handle different response formats
  let cars = []

  if (Array.isArray(data.data)) {
    // If data.data is already an array
    cars = data.data
  } else if (data.data && typeof data.data === 'object') {
    // If data.data is a single object, wrap it in an array
    cars = [data.data]
  } else if (Array.isArray(data)) {
    // If data itself is an array
    cars = data
  }


  return (

    <div className="min-h-screen bg-background">
      `{/* Hero Section */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Find Your Perfect Ride
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our premium collection of vehicles available for rent
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Suspense fallback={<IconLoader2 className='animate-spin' />}>

            <SearchFilter />
          </Suspense>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Available Vehicles
            </h2>
            <p className="text-muted-foreground mt-1">
              {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} found
            </p>
          </div>
        </div>

        {/* Cars Grid */}
        <Suspense fallback={<div className='flex items-center justify-center gap-2'>
          Loading Cars <IconLoader2 className='animate-spin'/>
        </div>}>

        <CarsGrid cars={cars} />
        </Suspense>
      </div>
    </div>
  );
};

export default CarsShowcasePage;