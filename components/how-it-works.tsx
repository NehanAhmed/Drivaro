import React from 'react';
import { Search, Calendar, Smile } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse and select",
      description: "Choose from our wide range of premium cars, select the pickup and return dates and locations that suit you best."
    },
    {
      icon: Calendar,
      title: "Book and confirm",
      description: "Book your desired car with just a few clicks and receive an instant confirmation via email or SMS."
    },
    {
      icon: Smile,
      title: "Enjoy your ride",
      description: "Pick up your car at the designated location and enjoy your premium driving experience with our top-quality service."
    }
  ];

  return (
    <section className="w-full py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How it works
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Renting a luxury car has never been easier. Our streamlined process makes it simple for you to book and confirm your vehicle of choice online
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => (
              <Card 
                key={index}
                className="border border-border bg-card hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className=" ">
                  <div className="flex gap-6 items-start">
                    {/* Icon Container */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-full md:w-14 md:h-14 rounded-2xl bg-muted flex items-center justify-center">
                        <step.icon className="w-6 h-6 md:w-7 md:h-7 text-foreground" strokeWidth={2} />
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Right Side - Car Image */}
          <div className="h-full">
            <div className="rounded-3xl bg-muted/30 ">
              <img
                width={100}
                height={100}
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80" 
                alt="Premium Jeep Wrangler"
                className="w-full h-full object-contain drop-shadow-2xl rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;