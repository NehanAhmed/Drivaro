// app/vendor/vehicles/page.tsx (Server Component)
export const dynamic = 'force-dynamic'

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import VehicleCard from "@/components/Vendor/vehicles-car-card"
import CreateCarModal from "@/components/Vendor/create-car-modal"
import { VehiclesHeader } from "@/components/Vendor/vehicles-header"
import { getVendorIdByUserId } from "@/hooks/getVendorIdByUserId"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Car, Plus, AlertCircle, TrendingUp, DollarSign } from "lucide-react"

interface IVehicle {
    id: string
    make: string
    model: string
    year: number
    color: string
    licensePlate: string
    category: string
    transmission: string
    fuelType: string
    status: string
    dailyRate: string
    images: string[] | null
    seats: number
    isInstantBooking: boolean
}

interface VehiclesResponse {
    success: boolean
    data: IVehicle[]
}

const Page = async () => {
    // Get session data using auth.api.getSession with headers
    const session = await auth.api.getSession({
        headers: await headers()
    })

    const userId = session?.session?.userId

    // Guard: Check if we have a valid userId
    if (!userId) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                            <h2 className="text-xl font-semibold">Authentication Error</h2>
                        </div>
                        <p className="text-muted-foreground">
                            Unable to find user ID in session. Please try logging in again.
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    // Get vendorId
    let vendorId: string | null = null

    try {
        vendorId = await getVendorIdByUserId(userId)
    } catch (error) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-destructive" />
                            <h2 className="text-xl font-semibold">Error Loading Vendor</h2>
                        </div>
                        <p className="text-muted-foreground">
                            There was an error loading your vendor profile. Please try again later.
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    // Guard: Handle case where vendor doesn't exist
    if (!vendorId) {
        return (
            <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                <Card className="border-accent/50 bg-accent/5">
                    <CardContent className="p-8 text-center">
                        <Car className="h-16 w-16 text-accent mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Vendor Registration Required</h2>
                        <p className="text-muted-foreground mb-6">
                            You need to register as a vendor first to add vehicles.
                        </p>
                        <Button>Complete Vendor Registration</Button>
                    </CardContent>
                </Card>
            </main>
        )
    }

    // Fetch vehicles
    let vehicles: VehiclesResponse = { success: false, data: [] }
    let fetchError = false
    let errorMessage = ""

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/${vendorId}/car`,
            {
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            errorMessage = errorData.error || `Server error: ${response.status}`
            fetchError = true
        } else {
            vehicles = await response.json()
        }
    } catch (error) {
        errorMessage = error instanceof Error ? error.message : "Unknown error"
        fetchError = true
    }

    // Calculate stats
    const stats = {
        total: vehicles.data?.length || 0,
        available: vehicles.data?.filter(v => v.status === 'available').length || 0,
        rented: vehicles.data?.filter(v => v.status === 'rented').length || 0,
        avgRate: vehicles.data?.length > 0 
            ? vehicles.data.reduce((sum, v) => sum + parseFloat(v.dailyRate), 0) / vehicles.data.length 
            : 0,
    }

    return (
        <main className="w-full  mx-auto px-4 md:px-8 py-8 space-y-8">
            {/* Header with Stats */}
            <VehiclesHeader stats={stats} />

            {/* Quick Stats Bar */}
            {vehicles.data && vehicles.data.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Car className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Fleet</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Available</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.available}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">On Rent</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.rented}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent/10">
                                    <DollarSign className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Avg. Daily Rate</p>
                                    <p className="text-2xl font-bold text-accent">${stats.avgRate.toFixed(0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Error State */}
            {fetchError && (
                <Card className="border-destructive/50 bg-destructive/5">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="h-5 w-5 text-destructive" />
                            <h3 className="font-semibold">Failed to load vehicles</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{errorMessage}</p>
                    </CardContent>
                </Card>
            )}

            {/* Vehicles Grid */}
            <div>
                {!vehicles.data || vehicles.data.length === 0 ? (
                    // Empty State
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="flex flex-col items-center justify-center py-16 px-6 relative">
                                <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                                    <Plus className="h-12 w-12 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2 text-center">Add Your First Vehicle</h2>
                                <p className="text-muted-foreground text-center mb-6 max-w-xs">
                                    Start growing your fleet and reach more customers today
                                </p>
                                <CreateCarModal vendorId={vendorId} />
                                <div className="mt-6 flex items-center gap-2">
                                    <Badge variant="outline" className="bg-primary/5">
                                        Quick Setup
                                    </Badge>
                                    <Badge variant="outline" className="bg-accent/5">
                                        Instant Approval
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    // Vehicles Grid with Add Card
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add New Vehicle Card */}
                        <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardContent className="flex flex-col items-center justify-center py-12 px-6 relative">
                                <div className="p-3 rounded-full bg-primary/10 mb-3 group-hover:scale-110 transition-transform">
                                    <Plus className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Add Vehicle</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    Expand your fleet
                                </p>
                                <CreateCarModal vendorId={vendorId} />
                            </CardContent>
                        </Card>

                        {/* Vehicle Cards */}
                        {vehicles.data.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom CTA for Empty State */}
            {vehicles.data && vehicles.data.length === 0 && !fetchError && (
                <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-xl font-semibold mb-2">Why List Your Vehicles?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <div>
                                <div className="p-3 rounded-full bg-primary/10 w-fit mx-auto mb-3">
                                    <DollarSign className="h-6 w-6 text-primary" />
                                </div>
                                <h4 className="font-semibold mb-1">Earn More</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set your own rates and maximize your earnings
                                </p>
                            </div>
                            <div>
                                <div className="p-3 rounded-full bg-accent/10 w-fit mx-auto mb-3">
                                    <TrendingUp className="h-6 w-6 text-accent" />
                                </div>
                                <h4 className="font-semibold mb-1">Grow Your Business</h4>
                                <p className="text-sm text-muted-foreground">
                                    Reach thousands of potential customers
                                </p>
                            </div>
                            <div>
                                <div className="p-3 rounded-full bg-green-500/10 w-fit mx-auto mb-3">
                                    <Car className="h-6 w-6 text-green-600" />
                                </div>
                                <h4 className="font-semibold mb-1">Full Control</h4>
                                <p className="text-sm text-muted-foreground">
                                    Manage availability and bookings easily
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    )
}

export default Page