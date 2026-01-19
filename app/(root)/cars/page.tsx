import SearchFilter from '@/components/Cars/Search-Filter'
import CarsSection from '@/components/Cars/cars-section'
import { Suspense } from 'react'
import { Loader2, Sparkles, CarFront } from 'lucide-react'

// Premium Loading State Component
const LoadingState = ({ label = "Loading" }: { label?: string }) => (
  <div className="w-full h-60 flex flex-col items-center justify-center space-y-4 text-muted-foreground">
    <div className="relative">
      <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
      <CarFront className="w-10 h-10 text-primary relative z-10 animate-pulse" strokeWidth={1.5} />
    </div>
    <div className="flex items-center gap-2 text-sm font-medium tracking-widest uppercase">
      <Loader2 className="w-3 h-3 animate-spin" />
      {label}
    </div>
  </div>
)

export default function CarsShowcasePage() {
  return (
    <div className="min-h-screen bg-background font-hanken-grotesk selection:bg-accent selection:text-accent-foreground">
      
      {/* Subtle Ambient Light (No funky gradients, just depth) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary/30 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Header Section */}
      <div className="border-b border-border/60 bg-background/50 backdrop-blur-sm  top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
          
          {/* Typography Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2  animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="h-[1px] w-8 bg-accent" />
              <span className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
                The Collection
              </span>
              <span className="h-[1px] w-8 bg-accent" />
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium font-cinzel text-foreground tracking-tight  animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Find Your <span className="italic text-primary font-normal">Drive</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-light leading-relaxed  animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Browse our curated fleet of premium vehicles. From executive sedans to high-performance supercars.
            </p>
          </div>

          {/* Search Filter Container */}
          <div className=" animate-in fade-in zoom-in-95 duration-700 delay-300">
            <Suspense fallback={<LoadingState label="Initializing Search..." />}>
              <div className="relative z-20   rounded-2xl  p-2">
                <SearchFilter />
              </div>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-xl font-cinzel text-foreground">
             Available Vehicles
           </h2>
           <div className="h-[1px] flex-1 bg-border ml-6 max-w-[200px]" />
        </div>

        <Suspense
          fallback={<LoadingState label="Fetching Fleet Availability..." />}
        >
          <CarsSection />
        </Suspense>
      </main>
    </div>
  )
}