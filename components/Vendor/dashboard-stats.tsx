// components/vendor/dashboard/dashboard-stats.tsx
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, Car, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardStatsProps {
  stats: {
    monthlyRevenue: number;
    totalBookings: number;
    activeBookings: number;
    totalVehicles: number;
    availableVehicles: number;
  };
  revenueGrowth: number;
}

export function DashboardStats({ stats, revenueGrowth }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Monthly Revenue',
      value: `$${stats.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: revenueGrowth,
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'After commission',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings.toString(),
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      description: 'All time',
    },
    {
      title: 'Active Rentals',
      value: stats.activeBookings.toString(),
      icon: Clock,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: 'Currently rented',
    },
    {
      title: 'Vehicle Fleet',
      value: `${stats.totalVehicles}`,
      subtitle: `${stats.availableVehicles} available`,
      icon: Car,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      description: 'Total vehicles',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        const hasChange = card.change !== undefined;
        const isPositive = card.change && card.change > 0;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 hover:shadow-lg transition-all duration-300 hover:border-primary/30 group relative overflow-hidden">
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor} group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  {hasChange && (
                    <Badge 
                      variant="outline" 
                      className={`${
                        isPositive 
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' 
                          : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {Math.abs(card.change!).toFixed(1)}%
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight mb-1">
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p className="text-sm text-muted-foreground">
                      {card.subtitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}