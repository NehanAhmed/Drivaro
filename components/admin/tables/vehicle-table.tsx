'use client';

import { Action, Column, DataTable, FilterOption } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';

import { Building2, Eye, Edit, CheckCircle2, XCircle, DollarSign, Car, Wrench, Trash2 } from 'lucide-react';

const vehicleColumns: Column<any>[] = [
    {
        key: 'make',
        label: 'Vehicle',
        sortable: true,
        render: (value, row) => (
            <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex items-center justify-center border border-border">
                    {row.images?.[0] ? (
                        <img src={row.images[0]} alt={`${value} ${row.model}`} className="object-cover w-full h-full" />
                    ) : (
                        <Car className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <div>
                    <p className="font-semibold">
                        {value} {row.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {row.year} • {row.color}
                    </p>
                    <p className="text-xs text-muted-foreground">{row.licensePlate}</p>
                </div>
            </div>
        ),
    },
    {
        key: 'category',
        label: 'Category',
        sortable: true,
        render: (value, row) => (
            <div className="space-y-1">
                <Badge variant="outline" className="capitalize">
                    {value}
                </Badge>
                <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                        {row.transmission}
                    </Badge>
                    <Badge variant="secondary" className="text-xs capitalize">
                        {row.fuelType}
                    </Badge>
                </div>
            </div>
        ),
    },
    {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (value) => {
            const config: Record<string, any> = {
                available: {
                    label: 'Available',
                    className: 'bg-green-500/10 text-green-700 dark:text-green-400',
                },
                rented: {
                    label: 'Rented',
                    className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
                },
                maintenance: {
                    label: 'Maintenance',
                    className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
                },
                inactive: {
                    label: 'Inactive',
                    className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
                },
            };
            const statusConfig = config[value] || config.inactive;
            return (
                <Badge variant="outline" className={statusConfig.className}>
                    {statusConfig.label}
                </Badge>
            );
        },
    },
    {
        key: 'dailyRate',
        label: 'Daily Rate',
        sortable: true,
        render: (value, row) => (
            <div>
                <p className="font-bold text-accent text-lg">${value}</p>
                <p className="text-xs text-muted-foreground">{row.seats} seats</p>
                {row.isInstantBooking && (
                    <Badge variant="outline" className="text-xs mt-1">
                        Instant
                    </Badge>
                )}
            </div>
        ),
    },
    {
        key: 'vendorName',
        label: 'Vendor',
        sortable: true,
        render: (value) => (
            <p className="text-sm text-muted-foreground">{value}</p>
        ),
    },
    {
        key: 'createdAt',
        label: 'Listed',
        sortable: true,
        render: (value) => (
            <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
        ),
    },
];



const vehicleFilters: FilterOption[] = [
    {
        key: 'status',
        label: 'Status',
        options: [
            { value: 'available', label: 'Available' },
            { value: 'rented', label: 'Rented' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'inactive', label: 'Inactive' },
        ],
    },
    {
        key: 'category',
        label: 'Category',
        options: [
            { value: 'economy', label: 'Economy' },
            { value: 'comfort', label: 'Comfort' },
            { value: 'luxury', label: 'Luxury' },
            { value: 'suv', label: 'SUV' },
            { value: 'sports', label: 'Sports' },
        ],
    },
    {
        key: 'fuelType',
        label: 'Fuel Type',
        options: [
            { value: 'petrol', label: 'Petrol' },
            { value: 'diesel', label: 'Diesel' },
            { value: 'electric', label: 'Electric' },
            { value: 'hybrid', label: 'Hybrid' },
        ],
    },
];




const vehicleActions: Action<any>[] = [
    {
        label: 'View Details',
        icon: Eye,
        onClick: (row) => console.log('View vehicle:', row),
    },
    {
        label: 'Edit Vehicle',
        icon: Edit,
        onClick: (row) => console.log('Edit vehicle:', row),
    },
    {
        label: 'Mark Available',
        icon: CheckCircle2,
        onClick: (row) => console.log('Mark available:', row),
        variant: 'success',
        show: (row) => row.status !== 'available',
    },
    {
        label: 'Send to Maintenance',
        icon: Wrench,
        onClick: (row) => console.log('Maintenance:', row),
        show: (row) => row.status === 'available',
    },
    {
        label: 'Deactivate',
        icon: Trash2,
        onClick: (row) => console.log('Deactivate:', row),
        variant: 'destructive',
        show: (row) => row.status !== 'inactive',
    },
];


// Export a wrapper component
export function VehiclesTable({ data }: { data: any[] }) {
    return (
        <DataTable
            data={data}
            columns={vehicleColumns}
            searchKey="name"
            searchPlaceholder="Search users..."
            filters={vehicleFilters}
            actions={vehicleActions}
        />
    );
}