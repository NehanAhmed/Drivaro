import CarCollection from '@/components/car-collection'
import CarDetailWrapper from '@/components/carDetailWrapper'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import RentBy from '@/components/rent-by'
import Service from '@/components/service'
import Testimonial from '@/components/testimonial'
import { IconLoader2 } from '@tabler/icons-react'
import React, { Suspense } from 'react'

const Page = async () => {



  return (
    <main className='w-full min-h-screen'>
      <Hero />
      <RentBy />
      <Suspense fallback={
        <div className="flex items-center justify-center gap-2">
          Loading Cars <IconLoader2 className="animate-spin" />
        </div>
      }>

        <CarDetailWrapper />
      </Suspense>
      <HowItWorks />
      <Service />
      <Testimonial />
    </main>
  )
}

export default Page