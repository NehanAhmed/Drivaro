// components/vendor/dashboard/vehicle-performance.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, TrendingUp, Star, ArrowRight, Trophy } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  image: string | null;
  licensePlate: string;
  status: string;
  totalBookings: number;
  revenue: number;
  rating: number;
}

interface VehiclePerformanceProps {
  vehicles: Vehicle[];
}

export function VehiclePerformance({ vehicles }: VehiclePerformanceProps) {
  const statusConfig: Record<string, string> = {
    available: 'bg-green-500/10 text-green-700 dark:text-green-400',
    rented: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    maintenance: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    inactive: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Top Performers
            </CardTitle>
            <CardDescription>Your highest earning vehicles</CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="font-semibold text-muted-foreground">No vehicles yet</p>
              <p className="text-sm text-muted-foreground">Add vehicles to see performance</p>
            </div>
          ) : (
            vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all hover:shadow-sm group relative overflow-hidden"
              >
                {/* Rank Badge */}
                {index < 3 && (
                  <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-accent text-accent-foreground' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                )}

                {/* Vehicle Image */}
                <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0 border border-border">
                  {vehicle.image ? (
                    <img 
                      src={vehicle.image} 
                      alt={vehicle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Vehicle Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold truncate">{vehicle.name}</p>
                    <Badge 
                      variant="outline" 
                      className={`${statusConfig[vehicle.status]} text-xs capitalize`}
                    >
                      {vehicle.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {vehicle.licensePlate}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-accent fill-accent" />
                      <span className="font-medium">{vehicle.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-muted-foreground">
                      {vehicle.totalBookings} booking{vehicle.totalBookings !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="text-right">
                  <p className="font-bold text-xl text-primary">
                    ${vehicle.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    Revenue
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {vehicles.length > 0 && (
          <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">
                  {vehicles.reduce((sum, v) => sum + v.totalBookings, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  ${vehicles.reduce((sum, v) => sum + v.revenue, 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Total Revenue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {vehicles.length > 0 
                    ? (vehicles.reduce((sum, v) => sum + v.rating, 0) / vehicles.length).toFixed(1)
                    : '0.0'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Avg. Rating</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}