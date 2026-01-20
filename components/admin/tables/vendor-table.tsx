'use client';

import { Action, Column, DataTable, FilterOption } from '@/components/admin/DataTable';
import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter,
    DialogHeader
} from '@/components/ui/dialog';

import { Building2, Eye, Edit, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';
import VendorApproveButton from '../VendorApproveButton';

interface Vendor {
    id: string;
    businessName: string;
    ownerName: string;
    email: string;
    submittedDate: string;
    carsCount: number;
}

// Export a wrapper component
export function VendorTable({ data }: { data: any[] }) {


    // Column definitions for users
    const vendorColumns: Column<any>[] = [
        {
            key: 'businessName',
            label: 'Business',
            sortable: true,
            render: (value, row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <p className="font-semibold">{value}</p>
                        <p className="text-sm text-muted-foreground">{row.ownerName}</p>
                        <p className="text-xs text-muted-foreground">{row.email}</p>
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
                    approved: {
                        label: 'Approved',
                        variant: 'default',
                        className: 'bg-green-500/10 text-green-700 dark:text-green-400',
                    },
                    pending: {
                        label: 'Pending',
                        variant: 'secondary',
                        className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
                    },
                    suspended: {
                        label: 'Suspended',
                        variant: 'destructive',
                        className: 'bg-red-500/10 text-red-700 dark:text-red-400',
                    },
                    rejected: {
                        label: 'Rejected',
                        variant: 'outline',
                        className: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
                    },
                };
                const statusConfig = config[value] || config.pending;
                return (
                    <Badge variant={statusConfig.variant} className={statusConfig.className}>
                        {statusConfig.label}
                    </Badge>
                );
            },
        },
        {
            key: 'carsCount',
            label: 'Vehicles',
            sortable: true,
            render: (value, row) => (
                <div className="text-center">
                    <p className="font-bold text-lg">{value}</p>
                    <p className="text-xs text-muted-foreground">{row.bookingsCount} bookings</p>
                </div>
            ),
        },
        {
            key: 'totalEarnings',
            label: 'Earnings',
            sortable: true,
            render: (value, row) => (
                <div>
                    <p className="font-semibold text-accent">${parseFloat(value).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                        Commission: {row.commissionRate}%
                    </p>
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            sortable: true,
            render: (value, row) => (
                <div>
                    <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
                    {row.approvedAt && (
                        <p className="text-xs text-muted-foreground">
                            Approved: {new Date(row.approvedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            ),
        },
    ];


    // Define filters HERE

    // Filter options
    const vendorFilters: FilterOption[] = [
        {
            key: 'status',
            label: 'Status',
            options: [
                { value: 'approved', label: 'Approved' },
                { value: 'pending', label: 'Pending' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'rejected', label: 'Rejected' },
            ],
        },
    ];


    const vendorActions: Action<any>[] = [
        {
            label: 'View Details',
            icon: Eye,
            onClick: (row) => console.log('View vendor:', row),
        },
        {
            label: 'Edit Vendor',
            icon: Edit,
            onClick: (row) => console.log('Edit vendor:', row),
        },
        {
            label: 'Approve',
            icon: CheckCircle2,
            onClick: (row) => handleApproveModal(row),
            variant: 'success',
            show: (row) => row.status === 'pending',
        },
        {
            label: 'Suspend',
            icon: XCircle,
            onClick: (row) => console.log('Suspend vendor:', row),
            variant: 'destructive',
            show: (row) => row.status === 'approved',
        },
        {
            label: 'Adjust Commission',
            icon: DollarSign,
            onClick: (row) => console.log('Adjust commission:', row),
            show: (row) => row.status === 'approved',
        },
    ];

    const handleApproveModal = (vendor: any) => {
        setvendorData(vendor)
        setopen(true)
    }
    const [vendorData, setvendorData] = useState<Vendor>()
    const [open, setopen] = useState(false)
    return (
        <>
            <Dialog open={open} onOpenChange={setopen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Vendor Application</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve {vendorData?.businessName}? They will be notified via email and can start listing their vehicles.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setopen(false)}>
                            Cancel
                        </Button>
                        <VendorApproveButton vendorId={vendorData?.id || ''} />
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DataTable
                data={data}
                columns={vendorColumns}
                searchKey="name"
                searchPlaceholder="Search users..."
                filters={vendorFilters}
                actions={vendorActions}
            />
        </>
    );
}