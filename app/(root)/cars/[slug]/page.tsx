import { ImageGallery } from '@/components/Cars/details/ImageGallery';
import { BookingForm } from '@/components/Cars/details/BookingForm';
import { db } from '@/lib/db';
import { car, user, vendor } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { IconCheck, IconClock, IconGasStation, IconGauge, IconMapPin, IconSettings, IconStar, IconUsers } from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { calculateBookingPrice } from '@/lib/pricing';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';




function getUserInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    if (email) {
        return email.slice(0, 2).toUpperCase();
    }
    return 'U';
}


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const carDetails = await db
        .select({
            car: car,
            vendor: vendor,
        })
        .from(car)
        .innerJoin(vendor, eq(car.vendorId, vendor.id))
        .where(eq(car.slug, slug))
        .limit(1);


    const { car: carData, vendor: vendorData } = carDetails[0];

    const [userVendor] = await db
        .select()
        .from(user)
        .where(eq(user.id, vendorData.userId))


    const initials = getUserInitials(userVendor.name, userVendor.email);

    return (

        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{carData.category}</span>
                        <span>·</span>
                        <span>{carData.locationAddress}</span>


                    </div>
                    <h1 className="text-4xl font-bold tracking-tight">
                        {carData.year} {carData.make} {carData.model}
                        {carData.isInstantBooking ? (
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
                        {carData.isInstantBooking && (
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
                        <ImageGallery images={carData.images || []} />

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
                                        <p className="font-medium capitalize">{carData.transmission}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconGasStation className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                                        <p className="font-medium capitalize">{carData.fuelType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconUsers className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Seats</p>
                                        <p className="font-medium">{carData.seats} Passengers</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconGauge className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Mileage Limit</p>
                                        <p className="font-medium">{carData.mileageLimitPerDay} mi/day</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconClock className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Min. Rental</p>
                                        <p className="font-medium">{carData.minimumRentalHours}h</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <IconMapPin className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Color</p>
                                        <p className="font-medium">{carData.color}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-6 rounded-2xl border bg-card p-6">
                            <h2 className="text-2xl font-bold">Features</h2>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {carData.features?.map((feature, idx) => (
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
                                    <span className="font-medium">{carData.mileageLimitPerDay} miles</span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-muted-foreground">Extra mileage cost</span>
                                    <span className="font-medium">${carData.extraMileageCost}/mile</span>
                                </div>
                                <div className="flex justify-between border-b pb-3">
                                    <span className="text-muted-foreground">Minimum rental period</span>
                                    <span className="font-medium">{carData.minimumRentalHours} hours</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Hosted by</span>
                                </div>
                            </div>
                        </div>
                        <div className='space-y-6 rounded-2xl border bg-card p-6'>
                            <h2 className='text-2xl font-bold'>Hosted by</h2>

                            {/* Vendor Header */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {userVendor.profileImageUrl ? (
                                        <Image
                                            src={userVendor.profileImageUrl}
                                            alt='vendor profile image'
                                            width={80}
                                            height={80}
                                            className='rounded-full object-cover object-center border-2 border-muted'
                                        />
                                    ) : (
                                        <Avatar className="h-20 w-20 border-2 border-muted">
                                            <AvatarImage src={userVendor.image || undefined} alt='profile Avatar' />
                                            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className='text-xl font-bold'>{userVendor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{vendorData.businessName}</p>
                                    <div className="flex items-center gap-2 pt-1">
                                        {vendorData.status === 'approved' && (
                                            <Badge variant="secondary" className="text-xs">
                                                <IconCheck className="h-3 w-3 mr-1" />
                                                Verified Vendor
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Vendor Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Member since</p>
                                    <p className="font-medium">
                                        {new Date(vendorData.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Response time</p>
                                    <p className="font-medium">Within 1 hour</p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-3 pt-2 border-t">
                                <div className="flex items-center gap-2 text-sm">
                                    <IconMapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-muted-foreground">Located in</span>
                                    <span className="font-medium">{carData.locationAddress}</span>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Professional car rental service with verified documentation and reliable support.
                                </p>
                            </div>

                            {/* Contact Button */}
                            <Link href={`/vendor/${userVendor.name}`} >
                                <Button variant="outline" className="w-full">
                                    Contact Vendor
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Booking Form */}
                    <div className="lg:col-span-1">
                        <BookingForm vendor={vendorData} car={carData} />
                    </div>
                </div>
            </div>
        </div>
    );
}