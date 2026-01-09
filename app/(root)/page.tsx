import CarCollection from '@/components/car-collection'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import RentBy from '@/components/rent-by'
import Service from '@/components/service'
import Testimonial from '@/components/testimonial'
import React from 'react'

const Page = () => {
  return (
    <main className='w-full min-h-screen'>
      <Hero />
      <RentBy />
      <CarCollection />
      <HowItWorks />
      <Service   />
      <Testimonial />
    </main>
  )
}

export default Page