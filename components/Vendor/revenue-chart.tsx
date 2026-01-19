// components/vendor/dashboard/revenue-chart.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    bookings: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);
  const avgRevenuePerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-muted-foreground">Revenue:</span>{' '}
              <span className="font-bold">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-muted-foreground">Bookings:</span>{' '}
              <span className="font-bold">{payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Revenue & Bookings Trend
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                Growing
              </Badge>
            </CardTitle>
            <CardDescription>Last 6 months performance overview</CardDescription>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm text-muted-foreground">Avg. per Booking</p>
            <p className="text-2xl font-bold text-primary">
              ${avgRevenuePerBooking.toFixed(0)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
            <p className="text-xl font-bold text-accent">{totalBookings}</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-xs text-muted-foreground mb-1">Best Month</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {data.reduce((max, item) => item.revenue > max.revenue ? item : max, data[0])?.month || 'N/A'}
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--primary))' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              label={{ value: 'Bookings', angle: 90, position: 'insideRight', fill: 'hsl(var(--accent))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', r: 5 }}
              activeDot={{ r: 7 }}
              name="Revenue ($)"
              fill="url(#revenueGradient)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke="hsl(var(--accent))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--accent))', r: 5 }}
              activeDot={{ r: 7 }}
              name="Bookings"
              fill="url(#bookingsGradient)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}