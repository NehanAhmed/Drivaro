import { ImageGallery } from '@/components/Cars/details/ImageGallery';
import { BookingForm } from '@/components/Cars/details/BookingForm';
import { db } from '@/lib/db';
import { car } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { IconCheck, IconClock, IconGasStation, IconGauge, IconMapPin, IconSettings, IconStar, IconUsers } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';







export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const [carDetails] = await db.select().from(car).where(eq(car.slug, slug))


    return (

        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{carDetails.category}</span>
                        <span>·</span>
                        <span>{carDetails.locationAddress}</span>
                        

                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {carDetails.year} {carDetails.make} {carDetails.model}
                        {carDetails.isInstantBooking ? (
                            <>
                                <span>·</span>
                                <Badge variant={'secondary'}>Instant Booking</Badge>
                            </>
                        ) : (null)}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <IconStar className="h-4 w-4 fill-accent text-accent" />

                        </div>
                        {carDetails.isInstantBooking && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-foreground">
                                <IconCheck className="h-3 w-3" />
                                Instant Booking
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Left Column - Images & Details */}
                    <div className="space-y-8 lg:col-span-2">
                        <ImageGallery images={carDetails.images || []} />

                        {/* Specifications */}
                        <div className="space-y-6 rounded-2xl border bg-card p-6">
                            <h2 className="text-2xl font-bold">Specifications</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconSettings className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transmission</p>
                                        <p className="font-medium capitalize">{carDetails.transmission}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconGasStation className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                                        <p className="font-medium capitalize">{carDetails.fuelType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconUsers className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Seats</p>
                                        <p className="font-medium">{carDetails.seats} Passengers</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconGauge className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Mileage Limit</p>
                                        <p className="font-medium">{carDetails.mileageLimitPerDay} mi/day</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconClock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Min. Rental</p>
                                        <p className="font-medium">{carDetails.minimumRentalHours}h</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconMapPin className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Color</p>
                                        <p className="font-medium">{carDetails.color}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-6 rounded-2xl border bg-card p-6">
                            <h2 className="text-2xl font-bold">Features</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {carDetails.features?.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <IconCheck className="h-4 w-4 text-accent" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Rental Terms */}
                        <div className="space-y-6 rounded-2xl border bg-card p-6">
                            <h2 className="text-2xl font-bold">Rental Terms</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-muted-foreground">Daily mileage limit</span>
                                    <span className="font-medium">{carDetails.mileageLimitPerDay} miles</span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-muted-foreground">Extra mileage cost</span>
                                    <span className="font-medium">${carDetails.extraMileageCost}/mile</span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-muted-foreground">Minimum rental period</span>
                                    <span className="font-medium">{carDetails.minimumRentalHours} hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Hosted by</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <BookingForm car={carDetails} />
                    </div>
                </div>
            </div>
        </div>
    );
}