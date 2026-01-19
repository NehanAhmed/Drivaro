import React from 'react';
import { Search, Calendar, Smile } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Browse and select",
      description: "Choose from our wide range of premium cars, select the pickup and return dates and locations that suit you best.",
      number: "01"
    },
    {
      icon: Calendar,
      title: "Book and confirm",
      description: "Book your desired car with just a few clicks and receive an instant confirmation via email or SMS.",
      number: "02"
    },
    {
      icon: Smile,
      title: "Enjoy your ride",
      description: "Pick up your car at the designated location and enjoy your premium driving experience with our top-quality service.",
      number: "03"
    }
  ];

  return (
    <section className="w-full py-20 px-4 md:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-cinzel   text-accent mb-5 tracking-tight" >
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            Renting a luxury car has never been easier. Our streamlined process makes it simple for you to book and confirm your vehicle of choice online
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="flex gap-6 items-start">
                  {/* Number Indicator */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <span className="text-6xl font-bold text-gray-100 select-none">
                        {step.number}
                      </span>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <step.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 space-y-3 pt-4">
                    <h3 className="text-2xl font-semibold text-gray-900 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-base text-gray-600 leading-relaxed font-light">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-7 top-20 w-0.5 h-16 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Car Image */}
          <div className="w-full h-full lg:pl-8">
            <div className="relative rounded-3xl  overflow-hidden">
              <div className="relative aspect-square">
                <Image
                  width={1000}
                  height={1000}
                  src="/Images/How-it-Works-Image.png" 
                  alt="Premium Jeep Wrangler"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Subtle accent element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gray-900 rounded-full opacity-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;