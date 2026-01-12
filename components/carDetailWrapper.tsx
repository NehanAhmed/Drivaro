import { db } from '@/lib/db'
import { car } from '@/lib/db/schema'
import React from 'react'
import CarCollection from './car-collection'

const CarDetailWrapper = async () => {
    const cars = await db.select().from(car)

    return (
        <>
            <CarCollection cars={cars} />

        </>
    )
}

export default CarDetailWrapper