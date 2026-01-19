'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'

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
    { name: 'Pickup', logo: '/car-types/pickup.svg' },
    { name: 'Wagon', logo: '/car-types/wagon.svg' },
    { name: 'Crossover', logo: '/car-types/crossover.svg' },
    { name: 'Limousine', logo: '/car-types/limousine.svg' },
]

const RentBy = () => {
    return (
        <section className='w-full py-24 bg-background font-hanken-grotesk overflow-hidden'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                
                {/* --- Brands Section --- */}
                <div className='mb-24'>
                    <div className='flex flex-col md:flex-row justify-between items-end mb-10'>
                        <div>
                            <span className='text-xs font-bold tracking-[0.3em] text-accent uppercase'>
                                Elite Partners
                            </span>
                            <h2 className='text-3xl md:text-4xl font-cinzel font-medium text-foreground mt-2'>
                                Browse by Brand
                            </h2>
                        </div>
                        <Link href="/cars" className='hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group'>
                            View Full Inventory 
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                        </Link>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                        {carBrands.map((brand, index) => (
                            <motion.div 
                                key={brand.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className='group flex flex-col items-center justify-center p-8 bg-card border border-border rounded-sm hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5'
                            >
                                {/* 
                                   NOTE: The 'dark:invert' class ensures black logos turn white in dark mode. 
                                   The 'grayscale' effect makes them look premium until hovered.
                                */}
                                <div className='relative w-16 h-16 md:w-20 md:h-20 mb-4 opacity-70 group-hover:opacity-100 transition-opacity'>
                                    <Image 
                                        src={brand.logo} 
                                        alt={brand.name} 
                                        fill
                                        className='object-contain grayscale group-hover:grayscale-0 transition-all duration-500 dark:invert'
                                    />
                                </div>
                                <span className='text-sm font-bold tracking-widest text-muted-foreground group-hover:text-foreground transition-colors uppercase'>
                                    {brand.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- Body Types Section --- */}
                <div>
                    <div className='flex flex-col md:flex-row justify-between items-end mb-10'>
                        <div>
                            <span className='text-xs font-bold tracking-[0.3em] text-accent uppercase'>
                                Find Your Style
                            </span>
                            <h2 className='text-3xl md:text-4xl font-cinzel font-medium text-foreground mt-2'>
                                Browse by Category
                            </h2>
                        </div>
                    </div>

                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
                        {carTypes.map((type, index) => (
                            <motion.div 
                                key={type.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className='group relative aspect-[4/3] flex flex-col items-center justify-center bg-secondary/30 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer overflow-hidden'
                            >
                                <div className='relative z-10 flex flex-col items-center'>
                                    <div className='relative w-24 h-16 mb-2'>
                                        {/* 
                                           On hover, we invert the image brightness so black outlines become white 
                                           when the card background turns dark blue (primary).
                                        */}
                                        <Image 
                                            src={type.logo} 
                                            alt={type.name} 
                                            fill
                                            className='object-contain dark:invert group-hover:brightness-0 group-hover:invert transition-all duration-300'
                                        />
                                    </div>
                                    <span className='font-cinzel text-lg font-semibold tracking-wide'>
                                        {type.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default RentBy