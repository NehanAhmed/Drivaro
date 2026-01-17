import { IconCheck, IconCreditCardPay, IconSparkles } from '@tabler/icons-react'
import React from 'react'

const Service = () => {
    return (
        <section className='border-t border-border'>
            <div className='max-w-7xl mx-auto px-6 py-20 md:py-24'>
                {/* Header */}
                <div className='max-w-2xl mx-auto text-center mb-16'>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 tracking-tight'>
                        Our Service & Benefits
                    </h1>
                    <p className='text-base md:text-lg text-muted-foreground leading-relaxed'>
                        To make renting easy and hassle-free, we provide a variety of services and advantages. We have you covered with a variety of vehicles and flexible rental terms.
                    </p>
                </div>

                {/* Services Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12'>
                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='w-14 h-14 rounded-full bg-muted flex items-center justify-center'>
                            <IconSparkles className='w-6 h-6 text-foreground' strokeWidth={1.5} />
                        </div>
                        <h2 className='text-xl font-semibold text-foreground'>Quality Choice</h2>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            We offer a wide range of high-quality vehicles to choose from, including luxury cars, SUVs, vans, and more.
                        </p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='w-14 h-14 rounded-full bg-muted flex items-center justify-center'>
                            <IconCreditCardPay className='w-6 h-6 text-foreground' strokeWidth={1.5} />
                        </div>
                        <h2 className='text-xl font-semibold text-foreground'>Affordable Prices</h2>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Our rental rates are highly competitive and affordable, allowing our customers to enjoy their trips without breaking the bank.
                        </p>
                    </div>

                    <div className='flex flex-col items-center text-center space-y-4'>
                        <div className='w-14 h-14 rounded-full bg-muted flex items-center justify-center'>
                            <IconCheck className='w-6 h-6 text-foreground' strokeWidth={1.5} />
                        </div>
                        <h2 className='text-xl font-semibold text-foreground'>Easy Booking</h2>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                            Our user-friendly booking system makes it simple to reserve your vehicle in just a few clicks.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Service