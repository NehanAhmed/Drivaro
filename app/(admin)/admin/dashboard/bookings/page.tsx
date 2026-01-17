// app/admin/bookings/page.tsx
import { db } from '@/lib/db';
import { booking, user, car, vendor } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { BookingTable } from '@/components/admin/tables/booking-table';
import {
    Car as CarIcon,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp
} from 'lucide-react';

async function getBookings() {
    const data = await db
        .select({
            id: booking.id,
            bookingNumber: booking.bookingNumber,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalDays: booking.totalDays,
            totalAmount: booking.totalAmount,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            createdAt: booking.createdAt,
            // Customer Info
            customerName: user.name,
            customerEmail: user.email,
            customerImage: user.image,
            // Car Info
            carMake: car.make,
            carModel: car.model,
            carPlate: car.licensePlate,
            // Vendor Info
            businessName: vendor.businessName,
        })
        .from(booking)
        .leftJoin(user, eq(booking.customerId, user.id))
        .leftJoin(car, eq(booking.carId, car.id))
        .leftJoin(vendor, eq(booking.vendorId, vendor.id))
        .orderBy(desc(booking.createdAt));

    return data;
}

export default async function BookingsPage() {
    const bookings = await getBookings();

    // Calculate Stats
    const stats = {
        total: bookings.length,
        active: bookings.filter(b => b.status === 'active').length,
        pending: bookings.filter(b => b.status === 'pending').length,
        revenue: bookings
            .filter(b => b.status !== 'cancelled')
            .reduce((acc, curr) => acc + Number(curr.totalAmount), 0),
        upcoming: bookings.filter(b => b.status === 'confirmed').length,
    };

    const statCards = [
        { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'text-primary' },
        { label: 'Pending Approval', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
        { label: 'Active Rentals', value: stats.active, icon: CarIcon, color: 'text-green-600' },
        { label: 'Upcoming', value: stats.upcoming, icon: CheckCircle2, color: 'text-blue-600' },
        { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600' },
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
                <p className="text-muted-foreground">Monitor and manage all car rental reservations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.label} className="p-4 border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-md bg-muted">
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>


            <BookingTable data={bookings} />

        </div>
    );
}