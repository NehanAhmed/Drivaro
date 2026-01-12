import { Card, CardContent } from "@/components/ui/card"
import VendorCarCard, { IVendorCarCard } from "@/components/Vendor/car-vendor-card"
import CreateCarModal from "@/components/Vendor/create-car-modal"
import { getVendorIdByUserId } from "@/hooks/getVendorIdByUserId"
import { auth } from "@/lib/auth"
import { cacheLife } from "next/cache"
import { headers } from "next/headers"

interface CarsResponse {
    success: boolean
    data: IVendorCarCard[]
}

const Page = async () => {
    
    // Get session data using auth.api.getSession with headers
    const session = await auth.api.getSession({
        headers: await headers()
    })


    // Try multiple possible locations for userId
    const userId = session?.session?.userId



    // Guard: Check if we have a valid userId
    if (!userId) {
        console.error("No userId found in session. Session data:", session)

        // Don't redirect - show error instead so we can debug
        return (
            <main className="w-full max-w-7xl flex flex-1 flex-col gap-6 ml-10">
                <div>
                    <h1 className="text-3xl">Your Vehicles</h1>
                    <p className="text-red-500">
                        Authentication Error: Unable to find user ID in session.
                    </p>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-2">
                            <p className="font-semibold">Debug Information:</p>
                            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                                {JSON.stringify(session, null, 2)}
                            </pre>
                            <p className="text-sm text-muted-foreground mt-4">
                                Please check your authentication configuration or contact support.
                            </p>
                        </div>
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
        console.error("Error fetching vendorId:", error)

        return (
            <main className="w-full max-w-7xl flex flex-1 flex-col gap-6 ml-10">
                <div>
                    <h1 className="text-3xl">Your Vehicles</h1>
                    <p className="text-red-500">Error loading vendor information.</p>
                </div>
                <Card>
                    <CardContent className="p-6">
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
        console.warn(`No vendor found for userId: ${userId}`)

        return (
            <main className="w-full max-w-7xl flex flex-1 flex-col gap-6 ml-10">
                <div>
                    <h1 className="text-3xl">Your Vehicles</h1>
                    <p>You need to register as a vendor first.</p>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">
                            Please complete your vendor registration to add vehicles.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            User ID: {userId}
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    // Fetch cars
    let cars: CarsResponse = { success: false, data: [] }
    let fetchError = false
    let errorMessage = ""
    try {
        
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/vendor/${vendorId}/car`,
            {
                cache: 'force-cache',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )


        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error("Failed to fetch vehicles:", response.status, errorData)
            errorMessage = errorData.error || `Server error: ${response.status}`
            fetchError = true
        } else {
            cars = await response.json()
        }
    } catch (error) {
        console.error("Error fetching vehicles:", error)
        errorMessage = error instanceof Error ? error.message : "Unknown error"
        fetchError = true
    }

    // Handle fetch errors gracefully
    if (fetchError) {
        return (
            <main className="w-full max-w-7xl flex flex-1 flex-col gap-6 ml-10">
                <div>
                    <h1 className="text-3xl">Your Vehicles</h1>
                    <p>These are the Vehicles that are registered with your account.</p>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-500 font-semibold mb-2">
                            Failed to load vehicles
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {errorMessage || "Please try again later."}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Vendor ID: {vendorId}
                        </p>
                    </CardContent>
                </Card>
            </main>
        )
    }

    return (
        <main className="w-full max-w-7xl flex flex-1 flex-col gap-6 ml-10">
            <div>
                <h1 className="text-3xl">Your Vehicles</h1>
                <p>These are the Vehicles that are registered with your account.</p>
            </div>

            <div>
                {!cars.data || cars.data.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="aspect-square w-full max-h-[600px] h-full bg-transparent border-dashed border-2 border-border">
                            <CardContent className="flex flex-col items-center justify-center h-full py-10">
                                <h1 className="text-xl font-semibold py-2">
                                    Get Started - Add Your Vehicle
                                </h1>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Expand your fleet and reach more customers
                                </p>
                                <CreateCarModal vendorId={vendorId} />
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Card className="w-full bg-transparent border-dashed border-2 border-border">
                            <CardContent className="flex flex-col items-center justify-center h-full py-10">
                                <h1 className="text-xl font-semibold py-2">
                                    Get Started - Add Your Vehicle
                                </h1>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Expand your fleet and reach more customers
                                </p>
                                <CreateCarModal vendorId={vendorId} />
                            </CardContent>
                        </Card>

                        {cars.data.map((car: IVendorCarCard) => (
                            <VendorCarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

export default Page