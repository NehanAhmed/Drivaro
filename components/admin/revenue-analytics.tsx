// components/admin/reports/revenue-analytics.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RevenueAnalyticsProps {
  data: Array<{
    month: string;
    revenue: number;
    commission: number;
    bookings: number;
  }>;
}

export function RevenueAnalytics({ data }: RevenueAnalyticsProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = data.reduce((sum, item) => sum + item.commission, 0);
  const avgBookingsPerMonth = data.reduce((sum, item) => sum + item.bookings, 0) / data.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="text-muted-foreground">Revenue:</span>
              <span className="font-bold">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-accent"></span>
              <span className="text-muted-foreground">Commission:</span>
              <span className="font-bold">${payload[1].value.toLocaleString()}</span>
            </p>
            <p className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-muted-foreground">Bookings:</span>
              <span className="font-bold">{payload[2].value}</span>
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
              Revenue Analytics
              <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                6 Months
              </Badge>
            </CardTitle>
            <CardDescription>Revenue, commission, and booking trends</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Chart
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Total Revenue (6mo)</p>
            <p className="text-2xl font-bold text-primary">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/10">
            <p className="text-xs text-muted-foreground mb-1">Total Commission</p>
            <p className="text-2xl font-bold text-accent">${totalCommission.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10">
            <p className="text-xs text-muted-foreground mb-1">Avg. Bookings/Month</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {avgBookingsPerMonth.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="Revenue ($)"
            />
            <Bar
              yAxisId="left"
              dataKey="commission"
              fill="hsl(var(--accent))"
              radius={[8, 8, 0, 0]}
              name="Commission ($)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="bookings"
              stroke="hsl(var(--chart-5))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--chart-5))', r: 5 }}
              name="Bookings"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}