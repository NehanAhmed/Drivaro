'use client'

import React, { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, Users, Fuel, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CarCard, { ICarCard } from '../CarCard'


const CarsGrid = ({ cars }: { cars: ICarCard[] }) => {
    const searchParams = useSearchParams()

    // Extract filter params from URL
    const q = searchParams?.get('q')?.toLowerCase() || ''
    const category = searchParams?.get('category') || 'all'
    const transmission = searchParams?.get('transmission') || 'all'

    // Memoized filtered results for performance
    const filteredCars = useMemo(() => {
        return cars.filter((car) => {
            // Search query filter (search by make or model)
            if (q) {
                const carTitle = `${car.make} ${car.model}`.toLowerCase()
                if (!carTitle.includes(q)) {
                    return false
                }
            }

            // Category filter
            if (category !== 'all' && car.category !== category) {
                return false
            }

            // Transmission filter
            if (transmission !== 'all' && car.transmission !== transmission) {
                return false
            }

            return true
        })
    }, [cars, q, category, transmission])
    return (
        <div>
            {filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.map((car) => (
                        <CarCard car={car} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        No vehicles found
                    </h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                </div>
            )}
        </div>
    )
}

export default CarsGrid