// components/admin/stats-cards.tsx
'use client';

import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { DollarSign, Calendar, Users, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardsProps {
  stats: {
    totalRevenue: number;
    revenueChange: number;
    totalBookings: number;
    bookingsChange: number;
    activeVendors: number;
    vendorsChange: number;
    pendingApprovals: number;
    approvalsChange: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: `$${(stats.totalRevenue / 1000).toFixed(1)}k`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toLocaleString(),
      change: stats.bookingsChange,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Active Vendors',
      value: stats.activeVendors.toString(),
      change: stats.vendorsChange,
      icon: Users,
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      change: stats.approvalsChange,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change > 0;
        const TrendIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-accent/50 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="font-medium">{card.title}</CardDescription>
                  <div className={`p-2 rounded-lg ${card.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold tracking-tight">{card.value}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{Math.abs(card.change)}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {isPositive ? '+' : ''}{card.change}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}