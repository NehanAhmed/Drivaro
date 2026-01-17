// app/admin/page.tsx (Server Component)
import { db } from "@/lib/db";
import { booking, vendor, user, car, document, review } from "@/lib/db/schema";
import { eq, and, sql, desc, gte, lt, count, sum, not, avg } from "drizzle-orm";
import { subDays, startOfMonth, format } from "date-fns";
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { StatsCards } from '@/components/admin/StatsCard';
import { RevenueChart } from '@/components/admin/RevenueChart';
import { RecentBookings } from '@/components/admin/RecentBookings';
import { VendorApprovals } from '@/components/admin/VendorApproval';

async function getDashboardStats() {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const sixtyDaysAgo = subDays(now, 60);

  // Helper to get stats for a specific date range
  const getStatsForRange = async (start: Date, end: Date) => {
    const result = await db
      .select({
        revenue: sum(booking.totalAmount),
        bookings: count(booking.id),
      })
      .from(booking)
      .where(
        and(
          gte(booking.createdAt, start),
          lt(booking.createdAt, end),
          not(eq(booking.status, "cancelled"))
        )
      );
    return {
      revenue: Number(result[0].revenue || 0),
      bookings: result[0].bookings || 0,
    };
  };

  const currentPeriod = await getStatsForRange(thirtyDaysAgo, now);
  const previousPeriod = await getStatsForRange(sixtyDaysAgo, thirtyDaysAgo);

  const activeVendorsCount = await db
    .select({ value: count() })
    .from(vendor)
    .where(eq(vendor.status, "approved"));

  const pendingApprovalsCount = await db
    .select({ value: count() })
    .from(vendor)
    .where(eq(vendor.status, "pending"));

  // Calculate percentage change helper
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    totalRevenue: currentPeriod.revenue,
    revenueChange: calculateChange(currentPeriod.revenue, previousPeriod.revenue),
    totalBookings: currentPeriod.bookings,
    bookingsChange: calculateChange(currentPeriod.bookings, previousPeriod.bookings),
    activeVendors: activeVendorsCount[0].value,
    vendorsChange: 0, // In a real app, you'd compare vs last month's vendor count
    pendingApprovals: pendingApprovalsCount[0].value,
    approvalsChange: 0,
  };
}

// -----------------------------------------------------------------------------
// 2. Recent Bookings (Joined with User and Car)
// -----------------------------------------------------------------------------
async function getRecentBookings() {
  const rows = await db
    .select({
      id: booking.id,
      bookingNumber: booking.bookingNumber,
      customerName: user.name,
      carMake: car.make,
      carModel: car.model,
      status: booking.status,
      totalAmount: booking.totalAmount,
      startDate: booking.startDate,
    })
    .from(booking)
    .leftJoin(user, eq(booking.customerId, user.id))
    .leftJoin(car, eq(booking.carId, car.id))
    .orderBy(desc(booking.createdAt))
    .limit(5);

  return rows.map(r => ({
    id: r.id,
    bookingNumber: r.bookingNumber,
    status: r.status,
    // Provide defaults for nullable join fields
    customerName: r.customerName ?? 'Unknown Customer',
    carMake: r.carMake ?? 'Unknown',
    carModel: r.carModel ?? 'Vehicle',
    // Convert types for UI
    startDate: r.startDate.toISOString(),
    totalAmount: r.totalAmount.toString()
  }));
}
// -----------------------------------------------------------------------------
// 3. Pending Vendors (with Car Count)
// -----------------------------------------------------------------------------
async function getPendingVendors() {
  const rows = await db
    .select({
      id: vendor.id,
      businessName: vendor.businessName,
      ownerName: user.name,
      email: user.email,
      submittedDate: vendor.createdAt,
      carsCount: sql<number>`(SELECT count(*) FROM ${car} WHERE ${car.vendorId} = ${vendor.id})`.mapWith(Number),
    })
    .from(vendor)
    .leftJoin(user, eq(vendor.userId, user.id))
    .where(eq(vendor.status, "pending"))
    .orderBy(desc(vendor.createdAt));

  return rows.map(r => ({
    id: r.id,
    businessName: r.businessName,
    carsCount: r.carsCount,
    // Provide defaults for nullable join fields
    ownerName: r.ownerName ?? 'Unknown Owner',
    email: r.email ?? 'No Email',
    // Convert types for UI
    submittedDate: r.submittedDate.toISOString()
  }));
}

// -----------------------------------------------------------------------------
// 4. Revenue Data (Aggregated by Month)
// -----------------------------------------------------------------------------
async function getRevenueData() {
  // Get last 6 months of data
  const result = await db
    .select({
      month: sql<string>`to_char(${booking.createdAt}, 'Mon')`,
      monthOrder: sql<number>`extract(month from ${booking.createdAt})`,
      revenue: sum(booking.totalAmount),
      bookings: count(booking.id),
    })
    .from(booking)
    .where(
      and(
        gte(booking.createdAt, subDays(new Date(), 180)),
        not(eq(booking.status, "cancelled"))
      )
    )
    .groupBy(sql`1`, sql`2`)
    .orderBy(sql`2`);

  return result.map(r => ({
    month: r.month,
    revenue: Number(r.revenue || 0),
    bookings: r.bookings,
  }));
}

async function getAdditionalStats() {
  const [carRes, bookingRes, docRes, reviewRes] = await Promise.all([
    // 1. Car Stats
    db.select({
      total: count(),
      available: sql<number>`count(*) filter (where ${car.status} = 'available')`.mapWith(Number),
    }).from(car),

    // 2. Active Rental Stats
    db.select({
      active: count(),
      endingToday: sql<number>`count(*) filter (where ${booking.endDate}::date = current_date)`.mapWith(Number),
    }).from(booking).where(eq(booking.status, 'active')),

    // 3. Document Stats
    db.select({
      pending: count()
    }).from(document).where(eq(document.status, 'pending')),

    // 4. Review Stats
    db.select({
      avgRating: avg(review.rating),
      totalReviews: count()
    }).from(review)
  ]);

  return {
    cars: carRes[0],
    bookings: bookingRes[0],
    docs: docRes[0],
    reviews: {
      avg: Number(reviewRes[0].avgRating || 0).toFixed(1),
      total: reviewRes[0].totalReviews
    }
  };
}
export default async function AdminDashboard() {
  const [stats, recentBookings, pendingVendors, revenueData, additionalStats] = await Promise.all([
    getDashboardStats(),
    getRecentBookings(),
    getPendingVendors(),
    getRevenueData(),
    getAdditionalStats(),

  ]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsCards stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Takes 2 columns */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue and booking trends</CardDescription>
              </div>
              <Badge variant="outline" className="bg-accent/10 text-accent-foreground">
                Last 6 Months
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Car className="h-4 w-4 mr-2" />
              Manage Vehicles
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View All Bookings
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Reports
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Document Verification
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings and Vendor Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBookings bookings={recentBookings} />
        <VendorApprovals vendors={pendingVendors} />
      </div>

      {/* Recent Bookings and Vendor Approvals */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RecentBookings bookings={recentBookings} />
        <VendorApprovals vendors={pendingVendors} />
      </div>

      {/* Dynamic Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Cars */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Total Cars</CardDescription>
              <Car className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{additionalStats.cars.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {additionalStats.cars.available} available
            </p>
          </CardContent>
        </Card>

        {/* Active Rentals */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Active Rentals</CardDescription>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{additionalStats.bookings.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {additionalStats.bookings.endingToday} ending today
            </p>
          </CardContent>
        </Card>

        {/* Pending Documents */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Pending Documents</CardDescription>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{additionalStats.docs.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs verification
            </p>
          </CardContent>
        </Card>

        {/* Customer Rating */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription>Customer Rating</CardDescription>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{additionalStats.reviews.avg}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {additionalStats.reviews.total.toLocaleString()} reviews
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}