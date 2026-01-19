'use client'

import React from 'react';
import { Search, Calendar, CarFront } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'motion/react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse & Select",
      description: "Explore our curated fleet of premium vehicles. Filter by model, brand, or date to find the perfect match for your journey.",
    },
    {
      icon: Calendar,
      title: "Book & Confirm",
      description: "Secure your reservation instantly. Our streamlined digital process requires just a few clicks—no paperwork, no hassle.",
    },
    {
      icon: CarFront, // Swapped 'Smile' for 'CarFront' as it's more context-appropriate for luxury
      title: "Drive Away",
      description: "Your vehicle will be prepped, polished, and waiting at your chosen location. Simply unlock and experience the drive.",
    }
  ];

  return (
    <section className="w-full py-24 px-4 md:px-8 bg-background text-foreground font-hanken-grotesk overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 space-y-4"
        >
          <span className="text-xs font-bold tracking-[0.3em] text-accent uppercase">
            Seamless Experience
          </span>
          <h2 className="text-4xl md:text-6xl font-cinzel font-medium text-foreground">
            How It Works
          </h2>
          <div className="w-24 h-[1px] bg-border mx-auto my-6" />
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-lg font-light">
            Renting a luxury car has never been easier. We have refined the process to ensure 
            effortless booking and instant confirmation.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side - Vertical Timeline */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative flex gap-8"
              >
                {/* Timeline Line (Background) */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-[1px] bg-border group-hover:bg-accent/50 transition-colors duration-500" />
                )}

                {/* Icon Circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-background border border-border group-hover:border-primary group-hover:bg-primary transition-all duration-300 flex items-center justify-center shadow-sm">
                    <step.icon 
                      className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" 
                      strokeWidth={1.5} 
                    />
                  </div>
                </div>
                
                {/* Text Content */}
                <div className="pb-16 pt-2">
                  <h3 className="text-xl font-cinzel font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Car Image with Minimal Decor */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-full min-h-[400px] flex items-center justify-center lg:justify-end"
          >
            {/* Minimal Circle Backdrop - Uses Theme Colors */}
            <div className="absolute w-[80%] aspect-square rounded-full border border-accent/20 bg-secondary/30" />
            
            {/* The Image */}
            <div className="relative z-10 w-full hover:scale-105 transition-transform duration-700 ease-out">
              <Image
                width={800}
                height={800}
                src="/Images/How-it-Works-Image.png" 
                alt="Premium Luxury Car"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>

            {/* Premium Detail Label */}
            <div className="absolute bottom-10 right-10 z-20 hidden md:block">
              <div className="bg-card/80 backdrop-blur-md border border-border px-6 py-3 rounded-none shadow-sm">
                <p className="font-cinzel text-primary text-sm font-bold">PREMIUM FLEET</p>
                <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Available 24/7</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HowItWorks;