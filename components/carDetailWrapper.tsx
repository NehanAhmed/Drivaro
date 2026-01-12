import React from 'react'

async function getCars() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/car`,
    { next: { revalidate: 3600 } }
  )

  if (!res.ok) throw new Error('Failed to fetch cars')

  const data = await res.json()

  if (Array.isArray(data?.data)) return data.data
  if (data?.data && typeof data.data === 'object') return [data.data]
  if (Array.isArray(data)) return data
  return []
}


const CarDetailWrapper = async() => {
      const cars = await getCars()

  return (
    <>
    
    </>
  )
}

export default CarDetailWrapper