'use client';

import { Action, Column, DataTable, FilterOption } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit, Ban, CheckCircle2, Mail } from 'lucide-react';

// Column definitions for users
const userColumns: Column<any>[] = [
    {
        key: 'name',
        label: 'User',
        sortable: true,
        render: (value, row) => (
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={row.image} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {value?.charAt(0) || 'U'}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{value}</p>
                    <p className="text-sm text-muted-foreground">{row.email}</p>
                </div>
            </div>
        ),
    },
    {
        key: 'role',
        label: 'Role',
        sortable: true,
        render: (value) => {
            const variants: Record<string, any> = {
                admin: { variant: 'default', color: 'bg-primary text-primary-foreground' },
                vendor: { variant: 'secondary', color: 'bg-accent text-accent-foreground' },
                customer: { variant: 'outline', color: '' },
            };
            const config = variants[value] || variants.customer;
            return (
                <Badge variant={config.variant} className={config.color}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Badge>
            );
        },
    },
    {
        key: 'phoneNumber',
        label: 'Phone',
        render: (value) => value || <span className="text-muted-foreground">—</span>,
    },
    {
        key: 'isVerified',
        label: 'Verification',
        sortable: true,
        render: (value, row) => (
            <div className="flex flex-col gap-1">
                <Badge variant={value ? 'default' : 'outline'} className="w-fit">
                    {value ? (
                        <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                        </>
                    ) : (
                        'Not Verified'
                    )}
                </Badge>
                {row.emailVerified && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email verified
                    </span>
                )}
            </div>
        ),
    },
    {
        key: 'createdAt',
        label: 'Joined',
        sortable: true,
        render: (value) => new Date(value).toLocaleDateString(),
    },
];


// Define filters HERE

// Filter options
const userFilters: FilterOption[] = [
    {
        key: 'role',
        label: 'Role',
        options: [
            { value: 'customer', label: 'Customer' },
            { value: 'vendor', label: 'Vendor' },
            { value: 'admin', label: 'Admin' },
        ],
    },
    {
        key: 'isVerified',
        label: 'Status',
        options: [
            { value: 'true', label: 'Verified' },
            { value: 'false', label: 'Unverified' },
        ],
    },
];


// Actions
const userActions: Action<any>[] = [
    {
        label: 'View Details',
        icon: Eye,
        onClick: (row) => console.log('View user:', row),
    },
    {
        label: 'Edit User',
        icon: Edit,
        onClick: (row) => console.log('Edit user:', row),
    },
    {
        label: 'Verify User',
        icon: CheckCircle2,
        onClick: (row) => console.log('Verify user:', row),
        variant: 'success',
        show: (row) => !row.isVerified,
    },
    {
        label: 'Ban User',
        icon: Ban,
        onClick: (row) => console.log('Ban user:', row),
        variant: 'destructive',
        show: (row) => row.role !== 'admin',
    },
];

// Export a wrapper component
export function UserTable({ data }: { data: any[] }) {
    return (
        <DataTable
            data={data}
            columns={userColumns}
            searchKey="name"
            searchPlaceholder="Search users..."
            filters={userFilters}
            actions={userActions}
        />
    );
}