import CarsGrid from '@/components/Cars/CarsGrid'
import { db } from '@/lib/db'
import { car } from '@/lib/db/schema'
import { ICarCard } from '../CarCard'


export default async function CarsSection() {
    const cars:ICarCard[] = await db.select().from(car)

    return (
        <>
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

            <CarsGrid cars={cars} />
        </>
    )
}
