'use client'
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, type Variants } from 'motion/react';

const DrivaroPreloader = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const duration = 3500; // 3.5 seconds
    const steps = 100;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setProgress(currentStep);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          controls.start({
            y: '-100%',
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } // Premium "Bezier" ease
          });
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [controls]);

  // Fixed TypeScript error: explicit typing for variants
  const smokeVariants: Variants = {
    initial: { 
      opacity: 0, 
      scale: 0.2,
      x: 0,
      y: 0 
    },
    animate: (i: number) => ({
      opacity: [0, 0.4, 0],
      scale: [0.2, 1.2, 2],
      x: [-10, -30 - (i * 10)], // Drift backward
      y: [0, -5 - (i * 5)], // Drift upward
      transition: {
        duration: 1.5,
        repeat: Infinity,
        delay: i * 0.1,
        ease: "easeOut"
      }
    })
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={controls}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden"
    >
      {/* Background Ambience (Subtle Gradient) */}
      <div className="absolute inset-0 bg-radial-[at_50%_0%] from-accent/5 to-transparent blur-2xl" />

      <div className="relative w-full max-w-3xl px-8 z-10 flex flex-col items-center">
        
        {/* Brand Name - Using Cinzel for Luxury feel */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="mb-24 text-center space-y-4"
        >
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold tracking-[0.2em] text-primary">
            DRIVARO
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-accent/50" />
            <p className="font-sans text-xs md:text-sm tracking-[0.4em] text-muted-foreground uppercase">
              Premium Car Rental
            </p>
            <div className="h-[1px] w-12 bg-accent/50" />
          </div>
        </motion.div>

        {/* The Track Container */}
        <div className="relative w-full">
          
          {/* Track Line (Background) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-border" />
          
          {/* Active Track Line (Progress) */}
          <motion.div 
            className="absolute top-1/2 left-0 h-[2px] bg-accent shadow-[0_0_10px_var(--color-accent)]"
            style={{ width: `${progress}%` }}
            transition={{ type: "tween", ease: "linear" }}
          />

          {/* Moving Car Container */}
          <div 
            className="relative"
            style={{ 
              left: `${progress}%`,
              transition: 'left 0.1s linear', // Smooth out the interval steps
              marginLeft: '-45px' // Center car on the point
            }}
          >
            {/* Speed Lines (Wind) */}
            <motion.div 
               className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0"
               animate={progress < 100 && progress > 10 ? { opacity: 1 } : { opacity: 0 }}
            >
               <div className="h-[1px] w-12 bg-primary/20 mb-1" />
               <div className="h-[1px] w-8 bg-primary/20 mt-1 ml-4" />
            </motion.div>

            {/* Smoke Particles */}
            <div className="absolute top-6 -left-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={smokeVariants}
                  initial="initial"
                  animate={progress < 99 ? "animate" : "initial"}
                  className="absolute h-3 w-3 rounded-full bg-muted-foreground/30 blur-[2px]"
                />
              ))}
            </div>

            {/* Premium Car SVG */}
            <motion.svg
              width="90"
              height="35"
              viewBox="0 0 90 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 drop-shadow-xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Car Chassis - Sleek Sports Profile */}
              <path 
                d="M2.5 25.5H8.5L13.5 15.5L28.5 10.5H50.5L68.5 13.5L83.5 17.5L87.5 21.5V26.5H79.5" 
                className="stroke-primary stroke-2 fill-none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path 
                d="M13.5 15.5H28.5L26.5 25.5" 
                className="stroke-primary/50 stroke-1 fill-none" 
              /> {/* Window detail */}
              
              <path 
                d="M2.5 25.5H16" 
                className="stroke-primary stroke-2" 
              />
              <path 
                d="M34 25.5H66" 
                className="stroke-primary stroke-2" 
              />
              
              {/* Back Wheel */}
              <g className="origin-[25px_25.5px]">
                <motion.g
                   animate={progress < 100 ? { rotate: 360 } : { rotate: 0 }}
                   transition={{ duration: 0.5, ease: "linear", repeat: Infinity }}
                   style={{ originX: '25px', originY: '25.5px' }}
                >
                  <circle cx="25" cy="25.5" r="8" className="stroke-accent stroke-2 fill-background" />
                  <circle cx="25" cy="25.5" r="2" className="fill-accent" />
                  <path d="M25 17.5V33.5" className="stroke-muted-foreground/50 stroke-1" />
                  <path d="M17 25.5H33" className="stroke-muted-foreground/50 stroke-1" />
                </motion.g>
              </g>

              {/* Front Wheel */}
              <g className="origin-[75px_25.5px]">
                <motion.g
                   animate={progress < 100 ? { rotate: 360 } : { rotate: 0 }}
                   transition={{ duration: 0.5, ease: "linear", repeat: Infinity }}
                   style={{ originX: '75px', originY: '25.5px' }}
                >
                  <circle cx="75" cy="25.5" r="8" className="stroke-accent stroke-2 fill-background" />
                  <circle cx="75" cy="25.5" r="2" className="fill-accent" />
                  <path d="M75 17.5V33.5" className="stroke-muted-foreground/50 stroke-1" />
                  <path d="M67 25.5H83" className="stroke-muted-foreground/50 stroke-1" />
                </motion.g>
              </g>

              {/* Headlight Shine */}
              <motion.path
                d="M87 23L95 25"
                className="stroke-accent/80 stroke-2 blur-[1px]"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
              />
            </motion.svg>
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-12 left-0 w-full px-8 flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1">Status</span>
            <span className="text-sm font-medium text-foreground tracking-wider flex items-center gap-2">
              {progress < 100 ? (
                <>
                  INITIALIZING
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >...</motion.span>
                </>
              ) : (
                <span className="text-accent">READY</span>
              )}
            </span>
          </motion.div>

          {/* Big Number Percentage */}
          <motion.div className="flex items-baseline">
            <span className="font-cinzel text-6xl md:text-8xl font-bold text-foreground/10 select-none">
              {progress.toString().padStart(2, '0')}
            </span>
            <span className="text-sm text-accent font-medium mb-2 ml-1">%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DrivaroPreloader;