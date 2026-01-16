// ============================================
// SERVER COMPONENT - app/(routes)/vendor/[name]/page.tsx
// ============================================

import { VendorAbout } from '@/components/Vendor/VendorAbout'
import { VendorCarsGrid } from '@/components/Vendor/VendorCarsGrid'
import { VendorProfileHeader } from '@/components/Vendor/VendorProfileHeader'
import { VendorStats } from '@/components/Vendor/VendorStats'
import { db } from '@/lib/db'
import { user, vendor, car } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'

export default async function VendorProfilePage({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}) {
  const { name } = await params

  // Fetch vendor profile with related data
  const vendorData = await db
    .select({
      user: user,
      vendor: vendor,
    })
    .from(user)
    .innerJoin(vendor, eq(user.id, vendor.userId))
    .where(eq(user.name, name))
    .limit(1)

  if (!vendorData || vendorData.length === 0) {
    notFound()
  }

  const { user: userProfile, vendor: vendorProfile } = vendorData[0]

  // Fetch vendor's cars
  const vendorCars = await db
    .select()
    .from(car)
    .where(eq(car.vendorId, vendorProfile.id))

  // Calculate stats
  const totalCars = vendorCars.length
  const availableCars = vendorCars.filter(c => c.status === 'available').length
  const avgDailyRate = vendorCars.length > 0
    ? vendorCars.reduce((sum, c) => sum + Number(c.dailyRate), 0) / vendorCars.length
    : 0

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <VendorProfileHeader 
          user={userProfile} 
          vendor={vendorProfile} 
        />

        {/* Stats Section */}
        <VendorStats
          totalCars={totalCars}
          availableCars={availableCars}
          avgDailyRate={avgDailyRate}
          memberSince={vendorProfile.createdAt}
          totalEarnings={Number(vendorProfile.totalEarnings)}
        />

        {/* About Section */}
        <VendorAbout
          businessName={vendorProfile.businessName}
          status={vendorProfile.status}
          approvedAt={vendorProfile.approvedAt}
        />

        {/* Cars Grid */}
        <VendorCarsGrid cars={vendorCars} />
      </div>
    </div>
  )
}
