// app/vendor/bookings/page.tsx (Server Component)
import { VendorBookingsTable } from '@/components/Vendor/tables/vendor-bookings-table';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { db } from '@/lib/db';
import { booking, car, user } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getVendorIdByUserId } from '@/hooks/getVendorIdByUserId';

// Define the booking with relations type
interface BookingWithRelations {
    id: string;
    bookingNumber: string;
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    customerImage: string | null;
    carId: string;
    carMake: string;
    carModel: string;
    carYear: number;
    carLicensePlate: string;
    carImage: string | null;
    startDate: Date;
    endDate: Date;
    pickupLocation: string;
    dropoffLocation: string;
    totalDays: number;
    basePrice: string;
    extraCharges: string;
    discount: string;
    tax: string;
    commission: string;
    totalAmount: string;
    depositAmount: string;
    status: string;
    paymentStatus: string;
    paymentIntentId: string | null;
    cancellationReason: string | null;
    cancelledAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Get vendor bookings with relations
async function getVendorBookings(vendorId: string): Promise<BookingWithRelations[]> {
    // Using manual joins with proper types
    const bookingsData = await db
        .select({
            // Booking fields
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            customerId: booking.customerId,
            carId: booking.carId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            pickupLocation: booking.pickupLocation,
            dropoffLocation: booking.dropoffLocation,
            totalDays: booking.totalDays,
            basePrice: booking.basePrice,
            extraCharges: booking.extraCharges,
            discount: booking.discount,
            tax: booking.tax,
            commission: booking.commission,
            totalAmount: booking.totalAmount,
            depositAmount: booking.depositAmount,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            paymentIntentId: booking.paymentIntentId,
            cancellationReason: booking.cancellationReason,
            cancelledAt: booking.cancelledAt,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
            // Customer fields
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phoneNumber,
            customerImage: user.image,
            // Car fields
            carMake: car.make,
            carModel: car.model,
            carYear: car.year,
            carLicensePlate: car.licensePlate,
            carImages: car.images,
        })
        .from(booking)
        .leftJoin(user, eq(booking.customerId, user.id))
        .leftJoin(car, eq(booking.carId, car.id))
        .where(eq(booking.vendorId, vendorId))
        .orderBy(desc(booking.createdAt));

    // Transform to match component interface
    return bookingsData.map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        customerId: b.customerId,
        customerName: b.customerName || 'Unknown',
        customerEmail: b.customerEmail || 'No email',
        customerPhone: b.customerPhone,
        customerImage: b.customerImage,
        carId: b.carId,
        carMake: b.carMake || 'Unknown',
        carModel: b.carModel || 'Unknown',
        carYear: b.carYear || 0,
        carLicensePlate: b.carLicensePlate || 'N/A',
        carImage: (b.carImages as string[] | null)?.[0] || null,
        startDate: b.startDate,
        endDate: b.endDate,
        pickupLocation: b.pickupLocation,
        dropoffLocation: b.dropoffLocation,
        totalDays: b.totalDays,
        basePrice: b.basePrice,
        extraCharges: b.extraCharges,
        discount: b.discount,
        tax: b.tax,
        commission: b.commission,
        totalAmount: b.totalAmount,
        depositAmount: b.depositAmount,
        status: b.status,
        paymentStatus: b.paymentStatus,
        paymentIntentId: b.paymentIntentId,
        cancellationReason: b.cancellationReason,
        cancelledAt: b.cancelledAt,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt,
    }));
}

export default async function VendorBookingsPage() {

    const session = await auth.api.getSession({
        headers: await headers()
    })
    const userId = session?.session?.userId!!;
    const vendorId = await getVendorIdByUserId(userId)

    const bookings = await getVendorBookings(vendorId!!);

    // Calculate stats
    const today = new Date();
    const stats = {
        total: bookings.length,
        active: bookings.filter((b) => {
            const start = new Date(b.startDate);
            const end = new Date(b.endDate);
            return b.status === 'active' && today >= start && today <= end;
        }).length,
        upcoming: bookings.filter((b) => {
            const start = new Date(b.startDate);
            return b.status === 'confirmed' && start > today;
        }).length,
        completed: bookings.filter((b) => b.status === 'completed').length,
        cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        totalRevenue: bookings
            .filter((b) => b.status === 'completed' && b.paymentStatus === 'paid')
            .reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0),
        pendingPayment: bookings
            .filter((b) => b.paymentStatus === 'pending' || b.paymentStatus === 'held')
            .reduce((sum, b) => sum + parseFloat(b.totalAmount), 0),
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        My Bookings
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage all your vehicle bookings and reservations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-sm">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </Badge>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-primary/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Bookings</p>
                            <p className="text-2xl font-bold mt-1">{stats.total}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-blue-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-blue-500/10">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Rentals</p>
                            <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">
                                {stats.active}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-accent/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-accent/10">
                            <AlertCircle className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Upcoming</p>
                            <p className="text-2xl font-bold mt-1 text-accent">
                                {stats.upcoming}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-green-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                                {stats.completed}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Revenue Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">
                        ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        From completed bookings
                    </p>
                </Card>

                <Card className="p-6 border-border/50 bg-gradient-to-br from-accent/5 to-primary/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Pending Payment</p>
                        <Clock className="h-5 w-5 text-accent" />
                    </div>
                    <p className="text-3xl font-bold text-accent">
                        ${stats.pendingPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Awaiting confirmation
                    </p>
                </Card>

                <Card className="p-6 border-border/50 bg-gradient-to-br from-red-500/5 to-destructive/5">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground font-medium">Cancelled</p>
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {stats.cancelled}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        This month
                    </p>
                </Card>
            </div>

            {/* Status Overview */}
            <Card className="p-4 border-border/50">
                <h3 className="font-semibold mb-4">Booking Status Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Pending', count: bookings.filter((b) => b.status === 'pending').length, color: 'text-yellow-600 dark:text-yellow-400' },
                        { label: 'Confirmed', count: bookings.filter((b) => b.status === 'confirmed').length, color: 'text-blue-600 dark:text-blue-400' },
                        { label: 'Active', count: stats.active, color: 'text-green-600 dark:text-green-400' },
                        { label: 'Completed', count: stats.completed, color: 'text-primary' },
                        { label: 'Cancelled', count: stats.cancelled, color: 'text-red-600 dark:text-red-400' },
                    ].map((item) => (
                        <div key={item.label} className="text-center p-3 rounded-lg bg-muted/30">
                            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                            <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Bookings Table */}
            <VendorBookingsTable data={bookings} />
        </div>
    );
}