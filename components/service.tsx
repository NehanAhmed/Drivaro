'use client'

import React from 'react'
import { motion, type Variants } from 'motion/react'
import { Gem, ShieldCheck, Clock } from 'lucide-react'

const Service = () => {
    const services = [
        {
            icon: Gem,
            title: "Premium Selection",
            description: "Access a curated fleet of high-end vehicles, from sport coupes to luxury SUVs, maintained to showroom standards."
        },
        {
            icon: ShieldCheck,
            title: "Competitive Value",
            description: "Experience luxury without hidden costs. We offer transparent pricing and exclusive value for short and long-term rentals."
        },
        {
            icon: Clock,
            title: "Seamless Experience",
            description: "Time is your ultimate luxury. Our digital-first booking and concierge delivery ensure you are on the road in minutes."
        }
    ];

    // Fixed: Explicitly typed as 'Variants'
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Fixed: Explicitly typed as 'Variants' and improved easing
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6, 
                // Premium "easeOut" curve (cubic-bezier)
                // This feels heavier and more luxurious than standard "easeOut"
                ease: [0.22, 1, 0.36, 1] 
            }
        }
    };

    return (
        <section className='w-full bg-background border-t border-border py-24 px-6 md:px-12 font-hanken-grotesk'>
            <div className='max-w-7xl mx-auto'>
                
                {/* Header Section */}
                <div className='flex flex-col md:flex-row justify-between items-end mb-20 gap-8'>
                    <div className='max-w-2xl'>
                        <motion.span 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className='text-xs font-bold tracking-[0.3em] text-accent uppercase mb-4 block'
                        >
                            Why Choose Drivaro
                        </motion.span>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className='text-4xl md:text-6xl font-cinzel font-medium text-foreground tracking-tight leading-tight'
                        >
                            Excellence in <br/>
                            <span className='text-muted-foreground italic'>Every Detail</span>
                        </motion.h1>
                    </div>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className='text-muted-foreground max-w-sm text-sm leading-relaxed text-right md:text-left'
                    >
                        We redefine the rental experience by combining top-tier vehicles with effortless service, ensuring every journey is memorable.
                    </motion.p>
                </div>

                {/* Services Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className='grid grid-cols-1 md:grid-cols-3 gap-6'
                >
                    {services.map((service, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className='group relative bg-card p-10 rounded-sm border border-border hover:border-primary transition-colors duration-500'
                        >
                            {/* Hover Accent Line */}
                            <div className='absolute top-0 left-0 w-0 h-[2px] bg-accent group-hover:w-full transition-all duration-500 ease-out' />

                            {/* Icon */}
                            <div className='mb-8'>
                                <div className='w-14 h-14 flex items-center justify-start'>
                                    <service.icon 
                                        className='w-10 h-10 text-primary group-hover:text-accent transition-colors duration-300' 
                                        strokeWidth={1} 
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className='space-y-4'>
                                <h2 className='text-2xl font-cinzel text-foreground group-hover:translate-x-1 transition-transform duration-300'>
                                    {service.title}
                                </h2>
                                <p className='text-muted-foreground text-sm leading-relaxed'>
                                    {service.description}
                                </p>
                            </div>

                            {/* Decorative Corner */}
                            <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                <div className='w-2 h-2 bg-primary rounded-full' />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default Service