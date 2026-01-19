// components/Vendor/vehicle-card.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Car,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Gauge,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface IVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  category: string;
  transmission: string;
  fuelType: string;
  status: string;
  dailyRate: string;
  images: string[] | null;
  seats: number;
  isInstantBooking: boolean;
}

interface VehicleCardProps {
  vehicle: IVehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [imageError, setImageError] = useState(false);

  const statusConfig: Record<string, { label: string; className: string }> = {
    available: {
      label: 'Available',
      className: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    },
    rented: {
      label: 'On Rent',
      className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    },
    maintenance: {
      label: 'Maintenance',
      className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
    },
  };

  const config = statusConfig[vehicle.status] || statusConfig.available;
  const vehicleImage = vehicle.images?.[0];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-border/50 hover:border-primary/30">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {vehicleImage && !imageError ? (
          <img
            src={vehicleImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Car className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}

        {/* Status Badge */}
        <Badge variant="outline" className={`absolute top-3 left-3 ${config.className}`}>
          {config.label}
        </Badge>

        {/* Instant Booking Badge */}
        {vehicle.isInstantBooking && (
          <Badge variant="outline" className="absolute top-3 right-3 bg-accent/10 text-accent border-accent/20">
            <Zap className="h-3 w-3 mr-1 fill-accent" />
            Instant
          </Badge>
        )}

        {/* Actions Dropdown */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 backdrop-blur-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit Vehicle
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Manage Availability
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-5 space-y-4">
        {/* Title and Category */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight mb-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-sm text-muted-foreground">
                {vehicle.year} • {vehicle.color}
              </p>
            </div>
            <Badge variant="outline" className="capitalize text-xs">
              {vehicle.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {vehicle.licensePlate}
          </p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-border/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm capitalize">{vehicle.fuelType}</span>
          </div>
        </div>

        {/* Pricing and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
            <p className="text-2xl font-bold text-primary">
              ${parseFloat(vehicle.dailyRate).toFixed(0)}
              <span className="text-sm text-muted-foreground font-normal">/day</span>
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}