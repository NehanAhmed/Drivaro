'use client'

import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { Star, Quote, ArrowRight } from 'lucide-react'

const Testimonial = () => {
    const reviews = [
        {
            text: "The booking process was effortless. The vehicle was in pristine condition, and the concierge service made me feel like a VIP. Simply the best rental experience.",
            author: "Leslie Alexander",
            role: "Business Executive",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            text: "Drivaro offers a fleet that is unmatched. Driving the Porsche 911 through the coastal roads was a dream. Transparent pricing and zero hidden fees.",
            author: "Jacob Jones",
            role: "Car Enthusiast",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            text: "I needed a luxury SUV for a family trip, and the Range Rover was impeccable. Clean, gassed up, and delivered to my door. Highly recommended.",
            author: "Jenny Wilson",
            role: "Travel Blogger",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
        }
    ];

    return (
        <section className="py-24 bg-background border-t border-border font-hanken-grotesk overflow-hidden">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-16 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
                            Testimonials
                        </span>
                        <h2 className="mt-3 text-4xl md:text-5xl font-medium font-cinzel text-foreground">
                            Client Experiences
                        </h2>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2 text-muted-foreground"
                    >
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                            ))}
                        </div>
                        <span className="text-sm font-medium tracking-wide">Rated 5.0 by 2,000+ Clients</span>
                    </motion.div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Background Decorative Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border hidden md:block -z-10" />

                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative flex flex-col h-full"
                        >
                            {/* Card */}
                            <div className="flex-1 bg-card p-8 rounded-sm border border-border group-hover:border-primary transition-colors duration-300 relative">
                                
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 opacity-10">
                                    <Quote className="w-10 h-10 text-foreground" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                                    ))}
                                </div>

                                {/* Text */}
                                <blockquote className="flex-1">
                                    <p className="text-base md:text-lg leading-relaxed text-foreground italic font-light">
                                        "{review.text}"
                                    </p>
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center mt-8 pt-6 border-t border-border/50">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border mr-4">
                                        <img 
                                            src={review.image} 
                                            alt={review.author}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground font-cinzel tracking-wide">
                                            {review.author}
                                        </p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Link */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <Link 
                        href="#" 
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors duration-300 border-b border-primary hover:border-accent pb-1 group"
                    >
                        View All Reviews 
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

            </div>
        </section>
    )
}

export default Testimonial