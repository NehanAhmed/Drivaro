'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CarFront, Sparkles } from 'lucide-react';

import CarCard, { ICarCard } from './CarCard';
import { Button } from './ui/button';

const CarCollection = ({ cars }: { cars: ICarCard[] }) => {
    const [activeTab, setActiveTab] = useState('Popular Car');
    const tabs = ['Popular Car', 'SUV', 'Electric', 'Luxury'];

    // Safe array check
    const safeCars = Array.isArray(cars) ? cars : [];

    const filteredCars = useMemo(() => {
        switch (activeTab) {
            case 'SUV':
                return safeCars.filter((c) => (c.category || '').toLowerCase() === 'suv');
            case 'Electric':
                return safeCars.filter((c) => {
                    const fuelType = (c.fuelType || '').toLowerCase();
                    return ['electric', 'ev', 'hybrid'].includes(fuelType);
                });
            case 'Luxury':
                return safeCars.filter((c) => {
                    const premiumMakes = ['mercedes', 'bmw', 'audi', 'lexus', 'ferrari', 'lamborghini', 'porsche', 'bentley', 'rolls-royce'];
                    const make = (c.make || '').toLowerCase();
                    const category = (c.category || '').toLowerCase();
                    const rate = typeof c.dailyRate === 'string' ? parseFloat(c.dailyRate) : (c.dailyRate || 0);
                    return premiumMakes.includes(make) || category === 'luxury' || rate > 100;
                });
            case 'Popular Car':
            default:
                return safeCars.filter((c) => c.status === 'available');
        }
    }, [activeTab, safeCars]);

    // Zero State (No cars at all in database)
    if (safeCars.length === 0) {
        return (
            <section className='w-full min-h-[50vh] flex flex-col items-center justify-center font-hanken-grotesk px-4 bg-background'>
                <div className='text-center space-y-4'>
                    <div className='bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <CarFront className='w-10 h-10 text-muted-foreground' />
                    </div>
                    <h1 className='text-3xl md:text-5xl font-cinzel font-bold text-foreground'>
                        Collection Update
                    </h1>
                    <p className='text-muted-foreground max-w-md mx-auto'>
                        We are currently curating our fleet to bring you the best experience. Check back soon.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className='w-full py-24 bg-background font-hanken-grotesk overflow-hidden'>
            <div className='max-w-7xl mx-auto px-6 lg:px-8'>
                
                {/* Header Section - Editorial Style */}
                <div className='flex flex-col items-center text-center mb-16 space-y-6'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className='text-xs font-bold tracking-[0.3em] text-accent uppercase flex items-center gap-2 justify-center mb-4'>
                            <Sparkles className="w-3 h-3" /> The Fleet
                        </span>
                        <h1 className='text-5xl md:text-7xl font-cinzel text-foreground leading-[1.1]'>
                            Curated for <br />
                            <span className='italic font-light text-primary'>Perfection</span>
                        </h1>
                    </motion.div>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className='text-lg text-muted-foreground max-w-2xl font-light leading-relaxed'
                    >
                        From executive saloons to high-performance sportscars, select a vehicle that complements your journey.
                    </motion.p>
                </div>

                {/* Tabs - Premium Pill Design */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='flex flex-wrap gap-3 justify-center mb-16'
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                relative px-8 py-3 rounded-full text-sm font-bold tracking-wider transition-all duration-300
                                border border-transparent hover:border-border
                                ${activeTab === tab 
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105' 
                                    : 'bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </motion.div>

                {/* Car Grid with Animation */}
                <div className='min-h-[400px]'>
                    <AnimatePresence mode="wait">
                        {filteredCars.length === 0 ? (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-card/50'
                            >
                                <CarFront className='w-12 h-12 text-muted-foreground/50 mb-4' />
                                <p className='text-xl font-cinzel text-foreground'>No vehicles found</p>
                                <p className='text-sm text-muted-foreground mt-2'>Try selecting a different category from the menu above.</p>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10'
                            >
                                {filteredCars.map((car, index) => (
                                    <motion.div
                                        key={car.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CarCard car={car} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                
                {/* View All Action */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className='mt-20 flex justify-center'
                >
                    <Link href="/cars">
                        <Button 
                            variant="outline" 
                            size="lg"
                            className='h-14 px-10 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group font-cinzel text-base tracking-widest'
                        >
                            View Full Collection
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}

export default CarCollection