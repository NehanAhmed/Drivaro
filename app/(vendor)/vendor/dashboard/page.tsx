// app/vendor/dashboard/page.tsx (Server Component)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  Calendar,
  Car,
  Users,
  DollarSign,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
} from 'lucide-react';
import { db } from '@/lib/db';
import { booking, car, review, vendor } from '@/lib/db/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { DashboardStats } from '@/components/Vendor/dashboard-stats';
import { RevenueChart } from '@/components/Vendor/revenue-chart';
import { RecentBookings } from '@/components/Vendor/recent-bookings';
import { VehiclePerformance } from '@/components/Vendor/vehicle-performance';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getVendorIdByUserId } from '@/hooks/getVendorIdByUserId';
import Link from 'next/link';

// Get vendor dashboard data
async function getVendorDashboardData(vendorId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get vendor info
  const vendorInfo = await db
    .select()
    .from(vendor)
    .where(eq(vendor.id, vendorId))
    .limit(1);

  // Get all bookings
  const allBookings = await db
    .select({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      customerId: booking.customerId,
      carId: booking.carId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      commission: booking.commission,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    })
    .from(booking)
    .where(eq(booking.vendorId, vendorId))
    .orderBy(desc(booking.createdAt));

  // Get recent bookings with customer and car info
  const recentBookings = await db
    .select({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalAmount: booking.totalAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      customerName: sql<string>`(SELECT name FROM "user" WHERE id = ${booking.customerId})`,
      carMake: car.make,
      carModel: car.model,
      carImage: car.images,
    })
    .from(booking)
    .leftJoin(car, eq(booking.carId, car.id))
    .where(eq(booking.vendorId, vendorId))
    .orderBy(desc(booking.createdAt))
    .limit(5);

  // Get all vendor cars
  const vendorCars = await db
    .select()
    .from(car)
    .where(eq(car.vendorId, vendorId));

  // Get reviews
  const vendorReviews = await db
    .select({
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    })
    .from(review)
    .innerJoin(booking, eq(review.bookingId, booking.id))
    .where(eq(booking.vendorId, vendorId))
    .orderBy(desc(review.createdAt));

  return {
    vendorInfo: vendorInfo[0],
    allBookings,
    recentBookings,
    vendorCars,
    vendorReviews,
  };
}

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const userId = session?.session?.userId!!;
  const vendorId = await getVendorIdByUserId(userId)

  const data = await getVendorDashboardData(vendorId!!);
  const { vendorInfo, allBookings, recentBookings, vendorCars, vendorReviews } = data;

  // Calculate stats
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const stats = {
    totalRevenue: allBookings
      .filter(b => b.status === 'completed' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0),
    monthlyRevenue: allBookings
      .filter(b =>
        b.status === 'completed' &&
        b.paymentStatus === 'paid' &&
        new Date(b.createdAt) >= thisMonth
      )
      .reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0),
    lastMonthRevenue: allBookings
      .filter(b =>
        b.status === 'completed' &&
        b.paymentStatus === 'paid' &&
        new Date(b.createdAt) >= lastMonth &&
        new Date(b.createdAt) < thisMonth
      )
      .reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0),
    totalBookings: allBookings.length,
    activeBookings: allBookings.filter(b => b.status === 'active').length,
    completedBookings: allBookings.filter(b => b.status === 'completed').length,
    pendingBookings: allBookings.filter(b => b.status === 'pending').length,
    totalVehicles: vendorCars.length,
    availableVehicles: vendorCars.filter(v => v.status === 'available').length,
    averageRating: vendorReviews.length > 0
      ? vendorReviews.reduce((sum, r) => sum + r.rating, 0) / vendorReviews.length
      : 0,
    totalReviews: vendorReviews.length,
  };

  const revenueGrowth = stats.lastMonthRevenue > 0
    ? ((stats.monthlyRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100
    : 0;

  // Generate monthly revenue data for chart (last 6 months)
  const monthlyRevenueData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() - (5 - i) + 1, 1);

    const monthBookings = allBookings.filter(b => {
      const createdDate = new Date(b.createdAt);
      return createdDate >= date && createdDate < nextMonth && b.status === 'completed' && b.paymentStatus === 'paid';
    });

    const revenue = monthBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0);
    const bookings = monthBookings.length;

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.round(revenue),
      bookings,
    };
  });

  // Vehicle performance data
  const vehiclePerformanceData = vendorCars.map(vehicle => {
    const vehicleBookings = allBookings.filter(b => b.carId === vehicle.id);
    const completedBookings = vehicleBookings.filter(b => b.status === 'completed' && b.paymentStatus === 'paid');
    const revenue = completedBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount) - parseFloat(b.commission), 0);

    return {
      id: vehicle.id,
      name: `${vehicle.make} ${vehicle.model}`,
      image: (vehicle.images as string[] | null)?.[0] || null,
      licensePlate: vehicle.licensePlate,
      status: vehicle.status,
      totalBookings: vehicleBookings.length,
      revenue: Math.round(revenue),
      rating: 4.5, // Calculate from reviews if needed
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Transform recent bookings
  const formattedRecentBookings = recentBookings.map(b => ({
    id: b.id,
    bookingNumber: b.bookingNumber,
    customerName: b.customerName || 'Unknown',
    carName: `${b.carMake || 'Unknown'} ${b.carModel || ''}`,
    carImage: (b.carImage as string[] | null)?.[0] || null,
    startDate: b.startDate,
    endDate: b.endDate,
    totalAmount: b.totalAmount,
    status: b.status,
    paymentStatus: b.paymentStatus,
  }));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {vendorInfo?.businessName || 'Vendor'}! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Link href={'/vendor/dashboard/vehicles'}>
            <Button >
              <Car className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <DashboardStats stats={stats} revenueGrowth={revenueGrowth} />

      {/* Quick Actions & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your business efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href={'/vendor/dashboard/vehicles'}>
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                Manage Vehicles
              </Button>
            </Link>
            <Link href={'/vendor/dashboard/bookings'}>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                View Bookings
              </Button>
            </Link>
            <Link href={'/vendor/dashboard/reports'}>
              <Button className="w-full justify-start" variant="outline">
                <DollarSign className="h-4 w-4 mr-2" />
                Financial Reports
              </Button>
            </Link>
            <Link href={'/vendor/dashboard/reviews'} >
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Customer Reviews
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card className="border-border/50 hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              Pending Actions
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.pendingBookings > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div>
                  <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                    Pending Confirmations
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting confirmation
                  </p>
                </div>
                <Badge variant="outline" className="bg-yellow-500/10">
                  {stats.pendingBookings}
                </Badge>
              </div>
            )}
            {vendorCars.filter(v => v.status === 'maintenance').length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div>
                  <p className="font-semibold text-red-700 dark:text-red-400">
                    Vehicles in Maintenance
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {vendorCars.filter(v => v.status === 'maintenance').length} vehicle{vendorCars.filter(v => v.status === 'maintenance').length !== 1 ? 's' : ''}
                  </p>
                </div>
                <Badge variant="outline" className="bg-red-500/10">
                  {vendorCars.filter(v => v.status === 'maintenance').length}
                </Badge>
              </div>
            )}
            {stats.pendingBookings === 0 && vendorCars.filter(v => v.status === 'maintenance').length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400 mb-2" />
                <p className="font-semibold text-green-700 dark:text-green-400">All Caught Up!</p>
                <p className="text-sm text-muted-foreground">No pending actions</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="border-border/50 hover:shadow-lg transition-all bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Performance
            </CardTitle>
            <CardDescription>Your business metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent fill-accent" />
                <span className="text-sm text-muted-foreground">Average Rating</span>
              </div>
              <span className="font-bold text-lg">
                {stats.averageRating.toFixed(1)} <span className="text-sm text-muted-foreground">/ 5.0</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Total Reviews</span>
              </div>
              <span className="font-bold text-lg">{stats.totalReviews}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">Completion Rate</span>
              </div>
              <span className="font-bold text-lg">
                {stats.totalBookings > 0
                  ? ((stats.completedBookings / stats.totalBookings) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">Fleet Utilization</span>
              </div>
              <span className="font-bold text-lg">
                {stats.totalVehicles > 0
                  ? (((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles) * 100).toFixed(0)
                  : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <RevenueChart data={monthlyRevenueData} />

      {/* Recent Activity & Top Performers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBookings bookings={formattedRecentBookings} />
        <VehiclePerformance vehicles={vehiclePerformanceData} />
      </div>
    </div>
  );
}