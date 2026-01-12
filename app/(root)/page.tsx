import CarCollection from '@/components/car-collection'
import Hero from '@/components/hero'
import HowItWorks from '@/components/how-it-works'
import RentBy from '@/components/rent-by'
import Service from '@/components/service'
import Testimonial from '@/components/testimonial'
import React from 'react'

const Page = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/car`,
      {
        cache: 'force-cache', // Cache for better performance
        next: { revalidate: 3600 } // Revalidate every hour
      }
    )
    
    if (!response.ok) {
      console.error('Failed to fetch cars:', response.status)
      throw new Error("An Error Occurred while fetching Cars.")
    }

    const data = await response.json()
    
    console.log('API Response:', data)
    
    // Handle different response formats
    let cars = []
    
    if (Array.isArray(data.data)) {
      // If data.data is already an array
      cars = data.data
    } else if (data.data && typeof data.data === 'object') {
      // If data.data is a single object, wrap it in an array
      cars = [data.data]
    } else if (Array.isArray(data)) {
      // If data itself is an array
      cars = data
    }
    
    console.log('Cars array length:', cars.length)

    return (
      <main className='w-full min-h-screen'>
        <Hero />
        <RentBy />
        <CarCollection cars={cars} />
        <HowItWorks />
        <Service />
        <Testimonial />
      </main>
    )
  } catch (error) {
    console.error('Error loading page:', error)
    
    // Fallback UI when car fetching fails
    // Still render other sections but show empty cars
    return (
      <main className='w-full min-h-screen'>
        <Hero />
        <RentBy />
        <CarCollection cars={[]} />
        <HowItWorks />
        <Service />
        <Testimonial />
      </main>
    )
  }
}

export default Page