// components/admin/tables/booking-table.tsx
'use client';

import { Action, Column, DataTable, FilterOption } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, XCircle, CheckCircle2, Car, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export function BookingTable({ data }: { data: any[] }) {
  const columns: Column<any>[] = [
    {
      key: 'bookingNumber',
      label: 'Booking ID',
      render: (val) => <span className="font-mono font-medium text-xs">{val}</span>,
    },
    {
      key: 'customerName',
      label: 'Customer',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.customerImage} />
            <AvatarFallback>{value?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">{value}</span>
            <span className="text-xs text-muted-foreground">{row.customerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'carDetails',
      label: 'Vehicle',
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.carMake} {row.carModel}</span>
          <span className="text-xs text-muted-foreground">{row.carPlate}</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Duration',
      render: (_, row) => (
        <div className="flex flex-col text-xs">
          <span>{format(new Date(row.startDate), 'MMM dd')} - {format(new Date(row.endDate), 'MMM dd')}</span>
          <span className="text-muted-foreground">{row.totalDays} days</span>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (val) => (
        <span className="font-semibold text-primary">
          ${Number(val).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (val) => {
        const colors: Record<string, string> = {
          pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          active: 'bg-green-500/10 text-green-600 border-green-500/20',
          completed: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
        };
        return (
          <Badge variant="outline" className={colors[val]}>
            {val.toUpperCase()}
          </Badge>
        );
      },
    },
    {
        key: 'paymentStatus',
        label: 'Payment',
        render: (val) => (
            <Badge variant={val === 'paid' ? 'default' : 'secondary'} className="text-[10px] h-5">
                {val}
            </Badge>
        )
    }
  ];

  const filters: FilterOption[] = [
    {
      key: 'status',
      label: 'Booking Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      options: [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'refunded', label: 'Refunded' },
      ],
    },
  ];

  const actions: Action<any>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (row) => console.log('View booking:', row.id),
    },
    {
      label: 'Approve',
      icon: CheckCircle2,
      show: (row) => row.status === 'pending',
      onClick: (row) => console.log('Approve:', row.id),
    },
    {
      label: 'Cancel Booking',
      icon: XCircle,
      variant: 'destructive',
      show: (row) => !['cancelled', 'completed'].includes(row.status),
      onClick: (row) => console.log('Cancel:', row.id),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      searchKey="bookingNumber"
      searchPlaceholder="Search booking ID..."
      filters={filters}
      actions={actions}
    />
  );
}