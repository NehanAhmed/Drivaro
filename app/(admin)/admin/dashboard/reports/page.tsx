// app/admin/reports/page.tsx (Server Component)
import { ReportsHeader } from '@/components/admin/reports-header';
import { ReportCard } from '@/components/admin/reports-card';
import { RevenueAnalytics } from '@/components/admin/revenue-analytics';
import { TransactionsList } from '@/components/admin/transaction-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Car,
  FileText,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { db } from '@/lib/db';
import { booking, transaction, user, vendor, car } from '@/lib/db/schema';
import { sql, eq, and, gte, desc } from 'drizzle-orm';

// Get comprehensive financial data
async function getFinancialReports() {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  // Get all transactions
  const allTransactions = await db
    .select({
      id: transaction.id,
      bookingId: transaction.bookingId,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      paymentMethod: transaction.paymentMethod,
      transactionReference: transaction.transactionReference,
      createdAt: transaction.createdAt,
      userName: sql<string>`(SELECT name FROM "user" WHERE id = ${transaction.userId})`,
      bookingNumber: sql<string>`(SELECT booking_number FROM booking WHERE id = ${transaction.bookingId})`,
    })
    .from(transaction)
    .orderBy(desc(transaction.createdAt))
    .limit(100);

  // Get bookings with financial data
  const allBookings = await db
    .select({
      id: booking.id,
      totalAmount: booking.totalAmount,
      commission: booking.commission,
      tax: booking.tax,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    })
    .from(booking);

  // Get vendor stats
  const vendorStats = await db
    .select({
      count: sql<number>`count(*)`,
      totalEarnings: sql<string>`COALESCE(SUM(CAST(total_earnings AS DECIMAL)), 0)`,
    })
    .from(vendor)
    .where(eq(vendor.status, 'approved'));

  // Get user stats
  const userStats = await db
    .select({
      total: sql<number>`count(*)`,
      customers: sql<number>`count(*) FILTER (WHERE role = 'customer')`,
      vendors: sql<number>`count(*) FILTER (WHERE role = 'vendor')`,
    })
    .from(user);

  // Get vehicle stats
  const vehicleStats = await db
    .select({
      total: sql<number>`count(*)`,
      available: sql<number>`count(*) FILTER (WHERE status = 'available')`,
    })
    .from(car);

  return {
    allTransactions,
    allBookings,
    vendorStats: vendorStats[0],
    userStats: userStats[0],
    vehicleStats: vehicleStats[0],
  };
}

export default async function ReportsPage() {
  const data = await getFinancialReports();
  const { allTransactions, allBookings, vendorStats, userStats, vehicleStats } = data;

  // Calculate financial metrics
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const completedBookings = allBookings.filter(
    b => b.status === 'completed' && b.paymentStatus === 'paid'
  );

  const thisMonthBookings = completedBookings.filter(
    b => new Date(b.createdAt) >= startOfMonth
  );

  const lastMonthBookings = completedBookings.filter(
    b => new Date(b.createdAt) >= startOfLastMonth && new Date(b.createdAt) < startOfMonth
  );

  const metrics = {
    totalRevenue: completedBookings.reduce(
      (sum, b) => sum + parseFloat(b.totalAmount), 0
    ),
    monthlyRevenue: thisMonthBookings.reduce(
      (sum, b) => sum + parseFloat(b.totalAmount), 0
    ),
    lastMonthRevenue: lastMonthBookings.reduce(
      (sum, b) => sum + parseFloat(b.totalAmount), 0
    ),
    totalCommission: completedBookings.reduce(
      (sum, b) => sum + parseFloat(b.commission), 0
    ),
    totalTax: completedBookings.reduce(
      (sum, b) => sum + parseFloat(b.tax), 0
    ),
    pendingPayments: allTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    completedTransactions: allTransactions.filter(t => t.status === 'completed').length,
    totalTransactions: allTransactions.length,
  };

  const revenueGrowth = metrics.lastMonthRevenue > 0
    ? ((metrics.monthlyRevenue - metrics.lastMonthRevenue) / metrics.lastMonthRevenue) * 100
    : 0;

  // Monthly revenue trend (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() - (5 - i) + 1, 1);

    const monthBookings = completedBookings.filter(b => {
      const createdDate = new Date(b.createdAt);
      return createdDate >= date && createdDate < nextMonth;
    });

    const revenue = monthBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0);
    const commission = monthBookings.reduce((sum, b) => sum + parseFloat(b.commission), 0);

    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.round(revenue),
      commission: Math.round(commission),
      bookings: monthBookings.length,
    };
  });

  // Transaction breakdown by type
  const transactionsByType = {
    payment: allTransactions.filter(t => t.type === 'payment').length,
    refund: allTransactions.filter(t => t.type === 'refund').length,
    payout: allTransactions.filter(t => t.type === 'payout').length,
    deposit_hold: allTransactions.filter(t => t.type === 'deposit_hold').length,
    deposit_release: allTransactions.filter(t => t.type === 'deposit_release').length,
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <ReportsHeader />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-lg transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <Badge 
                variant="outline" 
                className={`${
                  revenueGrowth >= 0 
                    ? 'bg-green-500/10 text-green-700 dark:text-green-400' 
                    : 'bg-red-500/10 text-red-700 dark:text-red-400'
                }`}
              >
                {revenueGrowth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {Math.abs(revenueGrowth).toFixed(1)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">${metrics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">All time earnings</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Wallet className="h-6 w-6 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Platform Commission</p>
            <p className="text-3xl font-bold text-accent">${metrics.totalCommission.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Total earned</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.totalTransactions}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {metrics.completedTransactions} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <TrendingUp className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              ${metrics.pendingPayments.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
       <ReportCard
  title="Revenue Report"
  description="Detailed revenue breakdown"
  iconName="DollarSign"  // Changed to string
  iconColor="text-primary"
  iconBg="bg-primary/10"
  stats={[
    { label: 'This Month', value: `$${metrics.monthlyRevenue.toLocaleString()}` },
    { label: 'Tax Collected', value: `$${metrics.totalTax.toLocaleString()}` },
  ]}
  reportType="revenue"
/>

<ReportCard
  title="Transaction Report"
  description="All platform transactions"
  iconName="CreditCard"  // Changed to string
  iconColor="text-blue-600 dark:text-blue-400"
  iconBg="bg-blue-500/10"
  stats={[
    { label: 'Payments', value: transactionsByType.payment.toString() },
    { label: 'Refunds', value: transactionsByType.refund.toString() },
  ]}
  reportType="transactions"
/>

<ReportCard
  title="Vendor Report"
  description="Vendor earnings & stats"
  iconName="Users"  // Changed to string
  iconColor="text-accent"
  iconBg="bg-accent/10"
  stats={[
    { label: 'Active Vendors', value: vendorStats.count.toString() },
    { label: 'Total Earnings', value: `$${parseFloat(vendorStats.totalEarnings).toLocaleString()}` },
  ]}
  reportType="vendors"
/>

<ReportCard
  title="Fleet Report"
  description="Vehicle performance"
  iconName="Car"  // Changed to string
  iconColor="text-green-600 dark:text-green-400"
  iconBg="bg-green-500/10"
  stats={[
    { label: 'Total Fleet', value: vehicleStats.total.toString() },
    { label: 'Available', value: vehicleStats.available.toString() },
  ]}
  reportType="fleet"
/>
      </div>

      {/* Revenue Analytics Chart */}
      <RevenueAnalytics data={monthlyData} />

      {/* Recent Transactions */}
      <TransactionsList 
        transactions={allTransactions.slice(0, 20).map(t => ({
          id: t.id,
          bookingNumber: t.bookingNumber || 'N/A',
          userName: t.userName || 'Unknown',
          type: t.type,
          amount: t.amount,
          status: t.status,
          paymentMethod: t.paymentMethod,
          createdAt: t.createdAt,
        }))}
      />
    </div>
  );
}