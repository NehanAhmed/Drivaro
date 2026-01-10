import React from 'react'

const carBrands = [
    { name: 'Toyota', logo: '/car-brands/toyota.svg' },
    { name: 'Honda', logo: '/car-brands/honda.svg' },
    { name: 'Ford', logo: '/car-brands/ford.svg' },
    { name: 'BMW', logo: '/car-brands/bmw.svg' },
    { name: 'Audi', logo: '/car-brands/audi.svg' },
    { name: 'Mercedes', logo: '/car-brands/mercedes.svg' },
    { name: 'Ferrari', logo: '/car-brands/ferrari.svg' },
    { name: 'Lamborghini', logo: '/car-brands/lamborghini.svg' },
    { name: 'Lexus', logo: '/car-brands/lexus.svg' },
    { name: 'Nissan', logo: '/car-brands/nissan.svg' },
]

const carTypes = [
    { name: 'SUV', logo: '/car-types/suv.svg' },
    { name: 'Sedan', logo: '/car-types/sedan.svg' },
    { name: 'Hatchback', logo: '/car-types/compact.svg' },
    { name: 'Convertible', logo: '/car-types/convertible.svg' },
    { name: 'Coupe', logo: '/car-types/coup.svg' },
    { name: 'Minivan', logo: '/car-types/mpv.svg' },
    { name: 'Pickup Truck', logo: '/car-types/pickup.svg' },
    { name: 'Wagon', logo: '/car-types/wagon.svg' },
    { name: 'Crossover', logo: '/car-types/crossover.svg' },
    { name: 'Limousine', logo: '/car-types/limousine.svg' },
]

const RentBy = () => {
    return (
        <section className='w-full flex flex-col items-center my-20 font-hanken-grotesk'>
            <div>
                <h1 className='text-2xl font-bold my-4'>Rent By Brands</h1>
                <div className='grid grid-cols-5 gap-4'>
                    {carBrands.map((brand) => (
                        <div key={brand.name} className='flex flex-col items-center  bg-accent rounded-lg p-4'>
                            <img src={brand.logo} alt={brand.name} className='w-50 h-20 object-contain mb-2' />
                            <span className='font-extrabold text-xl'>{brand.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className='my-30'>
                <h1 className='text-2xl font-bold my-4'>Rent By Body Type</h1>
                <div className='grid grid-cols-5 gap-4'>
                    {carTypes.map((type) => (
                        <div key={type.name} className='flex flex-col items-center  bg-accent rounded-lg p-4'>
                            <img src={type.logo} alt={type.name} className='w-50 h-20 object-contain mb-2' />
                            <span  className='font-extrabold text-xl'>{type.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default RentBy