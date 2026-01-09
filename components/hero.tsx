import Image from 'next/image'
import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Hero = () => {
  return (
    <section className='w-full  flex flex-col my-30  items-center  font-hanken-grotesk'>
      <div className='w-full flex items-center justify-center'>
        <h1 className='text-9xl font-economica font-extrabold w-200 text-center -my-20 z-10 '>Luxury Rides <br /> for every journey.</h1>
      </div>
      <div>
        <Image src={'/Images/Hero-Car-Image.png'} width={800} height={400} alt="Hero Car" />
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
          <Button>Find a Vehicle</Button>
        </div>
      </div>
    </section>
  )
}

export default Hero