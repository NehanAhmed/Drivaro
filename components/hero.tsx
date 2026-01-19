'use client'

import Image from 'next/image'
import React from 'react'
import { motion } from 'motion/react'
import { MapPin, Calendar, ArrowRight } from 'lucide-react' // Clean icons
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden pt-20 pb-10">
      
      {/* 1. Typography Section - Editorial Style */}
      <div className="relative z-10 text-center flex flex-col items-center space-y-6 max-w-5xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="font-hanken-grotesk text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">
            The Ultimate Driving Experience
          </span>
          <h1 className="font-cinzel text-5xl md:text-8xl font-medium tracking-tight leading-[1.1] text-primary">
            <span className="italic text-accent">Luxury</span> Rides <br />
            <span className="font-light">For Every Journey</span>
          </h1>
        </motion.div>
      </div>

      {/* 2. Car Image - Centerpiece */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-0 w-full max-w-[1200px] -mt-60 md:-mt-180 pointer-events-none"
      >
        {/* Note: Ensure your PNG is high-res with a transparent background */}
        <Image 
          src="/Images/Hero-Car-Image.png" 
          width={1200} 
          height={600} 
          alt="Luxury Hero Car" 
          className="w-full h-auto object-contain drop-shadow-2xl"
          priority
        />
      </motion.div>

      {/* 3. Search Widget - Sleek, Floating Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative z-20 -mt-8 md:-mt-90 w-full max-w-4xl px-4"
      >
        <div className="bg-card border border-border/60 shadow-2xl shadow-primary/5 rounded-2xl md:rounded-full p-2 md:p-3">
          <form className="flex flex-col md:flex-row items-center gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border/60">
            
            {/* Pick-up Location */}
            <div className="w-full md:w-1/4 px-4 py-3 md:py-0 hover:bg-muted/30 transition-colors rounded-xl md:rounded-none group cursor-pointer">
              <label className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground font-semibold mb-1 group-hover:text-accent transition-colors">
                <MapPin className="w-3 h-3" /> Pick Up
              </label>
              <input 
                type="text" 
                placeholder="City or Airport" 
                className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none font-hanken-grotesk"
              />
            </div>

            {/* Drop-off Location */}
            <div className="w-full md:w-1/4 px-4 py-3 md:py-0 hover:bg-muted/30 transition-colors rounded-xl md:rounded-none group cursor-pointer">
              <label className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground font-semibold mb-1 group-hover:text-accent transition-colors">
                <MapPin className="w-3 h-3" /> Drop Off
              </label>
              <input 
                type="text" 
                placeholder="City or Airport" 
                className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none font-hanken-grotesk"
              />
            </div>

            {/* Dates Row (Combined for mobile) */}
            <div className="w-full md:w-auto flex-1 flex divide-x divide-border/60">
              {/* Start Date */}
              <div className="w-1/2 px-4 py-3 md:py-0 hover:bg-muted/30 transition-colors group cursor-pointer">
                <label className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground font-semibold mb-1 group-hover:text-accent transition-colors">
                  <Calendar className="w-3 h-3" /> Start
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none font-hanken-grotesk opacity-80"
                />
              </div>

              {/* End Date */}
              <div className="w-1/2 px-4 py-3 md:py-0 hover:bg-muted/30 transition-colors group cursor-pointer">
                <label className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground font-semibold mb-1 group-hover:text-accent transition-colors">
                  <Calendar className="w-3 h-3" /> End
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none font-hanken-grotesk opacity-80"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="w-full md:w-auto p-1">
              <Button 
                size="lg" 
                className="w-full md:w-auto h-12 md:h-14 px-8 rounded-xl md:rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-cinzel tracking-wide shadow-lg"
              >
                Book Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

          </form>
        </div>
      </motion.div>

    </section>
  )
}

export default Hero