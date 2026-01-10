'use client';
import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { IconAutomaticGearbox, IconClock, IconEye, IconGasStation, IconMan, IconManualGearbox } from '@tabler/icons-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { motion } from 'motion/react';

export interface ICarCard {
    id: string;
    slug: string;
    vendorId: string;
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
    vinNumber: string;
    category: string;
    transmission: string;
    fuelType: string;
    seats: number;
    dailyRate: number;
    weeklyRate?: number;
    monthlyRate?: number;
    mileageLimitPerDay: number;
    extraMileageCost: number;
    locationLat?: number;
    locationLng?: number;
    locationAddress?: string;
    status: string;
    features?: string[];
    images?: string[];
    isInstantBooking: boolean;
    minimumRentalHours: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

const CarCard = ({ car }: { car: ICarCard }) => {
    const MotionCard = motion.create(Card);
    return (
        <MotionCard layoutId={car.id} className='w-full max-w-2xl'>
            <CardHeader>
                <Image src={car.images?.[0] || '/default-car-image.jpg'} alt={`${car.make} ${car.model}`} width={400} height={200} />
            </CardHeader>
            <CardContent>
                <h2 className='font-semibold text-lg text-start' >{car.make} {car.model}</h2>
                <h1 className='text-start my-2 text-2xl font-semibold'>{car.dailyRate} $ / <span className='text-lg font-medium text-neutral-400'>day</span></h1>
                <div className='w-full flex items-center justify-start my-5 gap-4'>
                    <div className='text-center flex items-center justify-center gap-1 flex-col'>
                        <IconClock />
                        <p className='text-sm text-center'>{car.minimumRentalHours} hours minimum</p>
                    </div>
                    <div className='text-center flex items-center justify-center gap-1 flex-col'>
                        {car.transmission === 'Automatic' ? <IconAutomaticGearbox /> : <IconManualGearbox />}
                        <p className='text-sm text-center'>{car.transmission}</p>
                    </div>
                    <div className='text-center flex items-center justify-center gap-1 flex-col'>
                        <IconMan />
                        <p className='text-sm text-center'>{car.seats} seats</p>
                    </div>
                    <div className="text-center flex items-center justify-center gap-1 flex-col">
                        <IconGasStation />
                        <p className='text-sm text-center'>{car.fuelType}</p>
                    </div>
                </div>
                <div className='w-full flex items-center justify-center mt-5 gap-2 '>
                    <Link href={`/cars/${car.slug}`} className=''>
                        <Button variant={'outline'}><IconEye /> View</Button>
                    </Link>
                    <Button className='w-[80%]'>Rent Now</Button>
                </div>
            </CardContent>
        </MotionCard>
    )
}

export default CarCard