'use client'
import React, { useState, useMemo } from 'react'
import CarCard, { ICarCard } from './CarCard';
import { Button } from './ui/button';
import Link from 'next/link';

// FIXED: Changed ICarCard to ICarCard[] (array)
const CarCollection = ({ cars }: { cars: ICarCard[] }) => {
    const [activeTab, setActiveTab] = useState('Popular Car');
    const tabs = ['Popular Car', 'SUV', 'Electric', 'Luxury']

    // Add safety check for cars prop and log for debugging
    const safeCars = Array.isArray(cars) ? cars : [];

    const filteredCars = useMemo(() => {
        switch (activeTab) {
            case 'SUV':
                return safeCars.filter((c) => (c.category || '').toLowerCase() === 'suv')
            case 'Electric':
                return safeCars.filter((c) => {
                    const fuelType = (c.fuelType || '').toLowerCase();
                    return fuelType === 'electric' || fuelType === 'ev' || fuelType === 'hybrid'
                })
            case 'Luxury':
                return safeCars.filter((c) => {
                    const premiumMakes = ['mercedes', 'bmw', 'audi', 'lexus', 'ferrari', 'lamborghini', 'porsche', 'bentley', 'rolls-royce'];
                    const make = (c.make || '').toLowerCase();
                    const category = (c.category || '').toLowerCase();
                    // Parse dailyRate if it's a string
                    const rate = typeof c.dailyRate === 'string' ? parseFloat(c.dailyRate) : (c.dailyRate || 0);
                    return premiumMakes.includes(make) || category === 'luxury' || rate > 100;
                })
            case 'Popular Car':
            default:
                return safeCars.filter((c) => c.status === 'available')
        }
    }, [activeTab, safeCars])


    // Show message if no cars at all
    if (safeCars.length === 0) {
        return (
            <section className='w-full flex flex-col items-center my-40 font-hanken-grotesk'>
                <div className='w-full max-w-7xl flex flex-col items-center text-center px-4'>
                    <h1 className='text-6xl font-extrabold'>Our Impressive Collection of Cars</h1>
                    <p className='text-lg my-3'>No cars available at the moment. Check back soon!</p>
                </div>
            </section>
        )
    }

    return (
        <section className='w-full flex flex-col items-center my-40 font-hanken-grotesk'>
            <div className='w-full max-w-7xl flex flex-col items-center text-center px-4'>
                <h1 className='text-6xl font-extrabold'>Our Impressive Collection of Cars</h1>
                <p className='text-lg max-w-3xl my-3'>
                    Ranging from elegant sedans to powerful sports cars, all carefully selected to provide our customers with the ultimate driving experience.
                </p>
                
                <div className='flex gap-3 my-4 flex-wrap justify-center'>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`min-w-[140px] px-6 rounded-full ${
                                activeTab === tab 
                                    ? 'bg-neutral-900 text-white' 
                                    : 'bg-neutral-100 hover:bg-neutral-200'
                            } flex items-center py-2 transition-colors justify-center border border-border shadow-sm cursor-pointer`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className='w-full mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {filteredCars.length === 0 ? (
                        <div className='col-span-full text-center py-10'>
                            <p className='text-lg text-muted-foreground'>
                                No cars match this filter.
                            </p>
                            <p className='text-sm text-muted-foreground mt-2'>
                                Try selecting a different category.
                            </p>
                        </div>
                    ) : (
                        filteredCars.map((car) => (
                            <div key={car.id}>
                                <CarCard car={car} />
                            </div>
                        ))
                    )}
                </div>
                
                <div className='mt-20'>
                    <Link href="/cars">
                        <Button className='px-8 py-5'>View All Cars</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default CarCollection