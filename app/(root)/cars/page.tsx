import SearchFilter from '@/components/Cars/Search-Filter'
import CarsSection from '@/components/Cars/cars-section'
import { Suspense } from 'react'
import { IconLoader2 } from '@tabler/icons-react'

export default function CarsShowcasePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

          <Suspense fallback={<IconLoader2 className="animate-spin mx-auto" />}>
            <SearchFilter />
          </Suspense>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-2">
              Loading Cars <IconLoader2 className="animate-spin" />
            </div>
          }
        >
          <CarsSection />
        </Suspense>
      </div>
    </div>
  )
}
