import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { IconCar } from '@tabler/icons-react'

const Hero = () => {
  return (
    <section className='w-full  flex flex-col  items-center  font-hanken-grotesk'>
      <div className='flex flex-col items-center justify-center my-15'> 
        <div>
          <h1 className='text-8xl font-cinzel font-semibold w-240 text-center leading-22'><span className='font-extrabold'>Luxury Rides</span>  for every journey.</h1>
        </div>
        <div className='flex items-center justify-start  h-100'>
          <Image src={'/Images/Hero-Car-Image.png'} width={1000} height={100} alt="Hero Car" className='' />
        </div>
      </div>
      <div className='w-260 my-10 h-35 rounded-2xl border border-border shadow-lg flex items-center justify-center gap-5 px-4 py-2'>
        <div className='text-start'>
          <p>Pick-up Location</p>
          <Input placeholder="Search A Location" className='bg-white' />
        </div>
        <div className='text-start'>
          <p>Pick-up Date</p>
          <Input placeholder="Search A Location" type='datetime-local' className='bg-white' />
        </div>
        <div className='text-start'>
          <p>Drop-off Location</p>
          <Input placeholder="Search A Location" className='bg-white' />
        </div>
        <div className='text-start'>
          <p>Drop-off Date</p>
          <Input placeholder="Search A Location" type='datetime-local' className='bg-white' />
        </div>

        <div className='flex flex-col items-end justify-end h-15'>
          <Button><IconCar /> Find a Vehicle</Button>
        </div>
      </div>
    </section>
  )
}

export default Hero