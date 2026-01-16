'use client'

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  IconGasStation, 
  IconSettings, 
  IconUsers, 
  IconMapPin,
  IconStar 
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

interface Car {
  id: string
  slug: string
  make: string
  model: string
  year: number
  category: string
  transmission: string
  fuelType: string
  seats: number
  dailyRate: string
  status: string
  images: string[] | null
  locationAddress: string | null
  isInstantBooking: boolean
}

interface VendorCarsGridProps {
  cars: Car[]
}

export function VendorCarsGrid({ cars }: VendorCarsGridProps) {
  if (cars.length === 0) {
    return (
      <div className="py-12">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No vehicles available at the moment.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Vehicles</h2>
        <Badge variant="secondary">{cars.length} Cars</Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Card key={car.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            {/* Car Image */}
            <Link href={`/cars/${car.slug}`}>
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {car.images && car.images.length > 0 ? (
                  <Image
                    src={car.images[0]}
                    alt={`${car.year} ${car.make} ${car.model}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Status Badge */}
                {car.status === 'available' && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
                  >
                    Available
                  </Badge>
                )}

                {car.isInstantBooking && (
                  <Badge 
                    variant="secondary" 
                    className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm"
                  >
                    Instant Book
                  </Badge>
                )}
              </div>
            </Link>

            {/* Car Details */}
            <div className="p-5 space-y-4">
              {/* Title & Category */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {car.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <IconStar className="h-3 w-3 fill-accent text-accent" />
                    <span>New</span>
                  </div>
                </div>
                <Link href={`/cars/${car.slug}`}>
                  <h3 className="text-lg font-semibold hover:text-primary transition-colors line-clamp-1">
                    {car.year} {car.make} {car.model}
                  </h3>
                </Link>
                {car.locationAddress && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <IconMapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{car.locationAddress}</span>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IconSettings className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize text-xs">{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IconGasStation className="h-4 w-4 flex-shrink-0" />
                  <span className="capitalize text-xs">{car.fuelType}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <IconUsers className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs">{car.seats}</span>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div>
                  <p className="text-2xl font-bold">${car.dailyRate}</p>
                  <p className="text-xs text-muted-foreground">per day</p>
                </div>
                <Link href={`/cars/${car.slug}`}>
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}