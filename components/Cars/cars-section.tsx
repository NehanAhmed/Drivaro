import CarsGrid from '@/components/Cars/CarsGrid'

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

export default async function CarsSection() {
  const cars = await getCars()

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Available Vehicles
          </h2>
          <p className="text-muted-foreground mt-1">
            {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} found
          </p>
        </div>
      </div>

      <CarsGrid cars={cars} />
    </>
  )
}
