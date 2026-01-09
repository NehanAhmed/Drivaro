import { IconCheck, IconCreditCardPay, IconSparkles } from '@tabler/icons-react'
import React from 'react'

const Service = () => {
    return (
        <section className='bg-black text-white p-10'>
            <div className='text-center my-10 flex flex-col items-center gap-4'>
                <h1 className='text-4xl font-semibold'>Our Service & Benefits</h1>
                <p className='w-200 text-center text-neutral-400'>To make renting easy and hassle-free, we provide a variety of services and advantages. We have you covered with a variety of vehicles and flexible rental terms.</p>
            </div>
            <div className='flex items-center justify-center gap-4'>
                <div className='max-w-xl text-center flex flex-col items-center gap-4 p-4 '>
                    <div className='bg-neutral-100 rounded-full w-10 h-10  flex items-center justify-center'><IconSparkles className='text-black' /></div>
                    <h2 className='text-2xl font-semibold'>Quality Choice</h2>
                    <p className='text-neutral-400'>We offer a wide range of high-quality vehicles to choose from, including luxury cars, SUVs, vans, and more.</p>
                </div>
                <div className='max-w-xl text-center flex flex-col items-center gap-4 p-4 '>
                    <div className='bg-neutral-100 rounded-full w-10 h-10  flex items-center justify-center'><IconCreditCardPay className='text-black' /></div>
                    <h2 className='text-2xl font-semibold'>Affordable Prices</h2>
                    <p className='text-neutral-400'>Our rental rates are highly competitive and affordable, allowing our customers to enjoy their trips without breaking the bank.</p>
                </div>
                <div className='max-w-xl text-center flex flex-col items-center gap-4 p-4 '>
                    <div className='bg-neutral-100 rounded-full w-10 h-10  flex items-center justify-center'><IconCheck className='text-black' /></div>
                    <h2 className='text-2xl font-semibold'>Easy Booking</h2>
                    <p className='text-neutral-400'>Our user-friendly booking system makes it simple to reserve your vehicle in just a few clicks.</p>
                </div>
            </div>
        </section>
    )
}

export default Service