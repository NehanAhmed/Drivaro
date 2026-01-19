// components/vendor/tables/vendor-bookings-table.tsx
'use client';

import { useState } from 'react';
import { DataTable, Column, FilterOption, Action } from '@/components/admin/DataTable';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Eye,
  CheckCircle2,
  XCircle,
  Car,
  Calendar,
  MapPin,
  DollarSign,
  Phone,
  Mail,
  CreditCard,
  FileText,
} from 'lucide-react';

interface VendorBooking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  customerImage: string | null;
  carId: string;
  carMake: string;
  carModel: string;
  carYear: number;
  carLicensePlate: string;
  carImage: string | null;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  basePrice: string;
  extraCharges: string;
  discount: string;
  tax: string;
  commission: string;
  totalAmount: string;
  depositAmount: string;
  status: string;
  paymentStatus: string;
  paymentIntentId: string | null;
  cancellationReason: string | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function VendorBookingsTable({ data }: { data: VendorBooking[] }) {
  const [selectedBooking, setSelectedBooking] = useState<VendorBooking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleView = (booking: VendorBooking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const handleConfirm = (booking: VendorBooking) => {
    setSelectedBooking(booking);
    setIsConfirmDialogOpen(true);
  };

  const handleCancel = (booking: VendorBooking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };

  const confirmBooking = () => {
    console.log('Confirming booking:', selectedBooking);
    setIsConfirmDialogOpen(false);
    setSelectedBooking(null);
  };

  const cancelBooking = () => {
    console.log('Cancelling booking:', selectedBooking, 'Reason:', cancellationReason);
    setIsCancelDialogOpen(false);
    setSelectedBooking(null);
    setCancellationReason('');
  };

  const bookingColumns: Column<VendorBooking>[] = [
    {
      key: 'bookingNumber',
      label: 'Booking',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center border border-border">
            {row.carImage ? (
              <img src={row.carImage} alt={`${row.carMake} ${row.carModel}`} className="object-cover w-full h-full" />
            ) : (
              <Car className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold">{value}</p>
            <p className="text-sm text-muted-foreground">
              {row.carMake} {row.carModel}
            </p>
            <p className="text-xs text-muted-foreground">{row.carLicensePlate}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={row.customerImage || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {value?.charAt(0) || 'C'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.customerEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Rental Period',
      sortable: true,
      render: (value, row) => {
        const start = new Date(value);
        const end = new Date(row.endDate);
        const today = new Date();
        const isActive = today >= start && today <= end;
        const isUpcoming = start > today;

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                {start.toLocaleDateString()} - {end.toLocaleDateString()}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              {row.totalDays} {row.totalDays === 1 ? 'day' : 'days'}
            </p>
            {isActive && (
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400">
                In Progress
              </Badge>
            )}
            {isUpcoming && (
              <Badge variant="outline" className="text-xs bg-accent/10 text-accent">
                Upcoming
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => {
        const statusConfig: Record<string, any> = {
          pending: {
            label: 'Pending',
            className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
          },
          confirmed: {
            label: 'Confirmed',
            className: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
          },
          active: {
            label: 'Active',
            className: 'bg-green-500/10 text-green-700 dark:text-green-400',
          },
          completed: {
            label: 'Completed',
            className: 'bg-primary/10 text-primary',
          },
          cancelled: {
            label: 'Cancelled',
            className: 'bg-red-500/10 text-red-700 dark:text-red-400',
          },
        };
        const config = statusConfig[value] || statusConfig.pending;

        const paymentConfig: Record<string, any> = {
          pending: { label: 'Payment Pending', color: 'text-yellow-600' },
          held: { label: 'Deposit Held', color: 'text-blue-600' },
          paid: { label: 'Paid', color: 'text-green-600' },
          refunded: { label: 'Refunded', color: 'text-gray-600' },
        };
        const payConfig = paymentConfig[row.paymentStatus] || paymentConfig.pending;

        return (
          <div className="space-y-1">
            <Badge variant="outline" className={config.className}>
              {config.label}
            </Badge>
            <p className={`text-xs ${payConfig.color}`}>
              {payConfig.label}
            </p>
          </div>
        );
      },
    },
    {
      key: 'totalAmount',
      label: 'Amount',
      sortable: true,
      render: (value, row) => {
        const total = parseFloat(value);
        const commission = parseFloat(row.commission);
        const earnings = total - commission;

        return (
          <div>
            <p className="font-bold text-lg text-primary">${total.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              Commission: ${commission.toFixed(2)}
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              You earn: ${earnings.toFixed(2)}
            </p>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Booked On',
      sortable: true,
      render: (value) => (
        <div>
          <p className="text-sm">{new Date(value).toLocaleDateString()}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(value).toLocaleTimeString()}
          </p>
        </div>
      ),
    },
  ];

  const bookingFilters: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
      ],
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'held', label: 'Held' },
        { value: 'paid', label: 'Paid' },
        { value: 'refunded', label: 'Refunded' },
      ],
    },
  ];

  const bookingActions: Action<VendorBooking>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: handleView,
    },
    {
      label: 'Confirm Booking',
      icon: CheckCircle2,
      onClick: handleConfirm,
      variant: 'success',
      show: (row) => row.status === 'pending',
    },
    {
      label: 'Cancel Booking',
      icon: XCircle,
      onClick: handleCancel,
      variant: 'destructive',
      show: (row) => row.status === 'pending' || row.status === 'confirmed',
    },
    {
      label: 'Contact Customer',
      icon: Phone,
      onClick: (row) => {
        if (row.customerPhone) {
          window.location.href = `tel:${row.customerPhone}`;
        }
      },
      show: (row) => !!row.customerPhone,
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={bookingColumns}
        searchKey="bookingNumber"
        searchPlaceholder="Search by booking number or customer..."
        filters={bookingFilters}
        actions={bookingActions}
        emptyMessage="No bookings found"
      />

      {/* View Booking Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Complete information for booking {selectedBooking?.bookingNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg border ${
                selectedBooking.status === 'completed' ? 'bg-green-500/10 border-green-500/20' :
                selectedBooking.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20' :
                selectedBooking.status === 'active' ? 'bg-blue-500/10 border-blue-500/20' :
                'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg capitalize">{selectedBooking.status} Booking</p>
                    <p className="text-sm text-muted-foreground">
                      Payment Status: {selectedBooking.paymentStatus}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-lg">
                    {selectedBooking.bookingNumber}
                  </Badge>
                </div>
              </div>

              {/* Customer & Vehicle Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedBooking.customerImage || undefined} />
                        <AvatarFallback>{selectedBooking.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedBooking.customerName}</p>
                        <p className="text-sm text-muted-foreground">{selectedBooking.customerEmail}</p>
                        {selectedBooking.customerPhone && (
                          <p className="text-sm text-muted-foreground">{selectedBooking.customerPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Information
                  </h3>
                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <p className="font-medium text-lg">
                      {selectedBooking.carMake} {selectedBooking.carModel} ({selectedBooking.carYear})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      License: {selectedBooking.carLicensePlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rental Details */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Rental Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-muted-foreground text-xs">Start Date</Label>
                    <p className="font-medium">{new Date(selectedBooking.startDate).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-muted-foreground text-xs">End Date</Label>
                    <p className="font-medium">{new Date(selectedBooking.endDate).toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-muted-foreground text-xs">Pickup Location</Label>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedBooking.pickupLocation}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <Label className="text-muted-foreground text-xs">Dropoff Location</Label>
                    <p className="font-medium flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {selectedBooking.dropoffLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Breakdown
                </h3>
                <div className="p-4 rounded-lg border border-border space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price ({selectedBooking.totalDays} days)</span>
                    <span className="font-medium">${parseFloat(selectedBooking.basePrice).toFixed(2)}</span>
                  </div>
                  {parseFloat(selectedBooking.extraCharges) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extra Charges</span>
                      <span className="font-medium">${parseFloat(selectedBooking.extraCharges).toFixed(2)}</span>
                    </div>
                  )}
                  {parseFloat(selectedBooking.discount) > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${parseFloat(selectedBooking.discount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${parseFloat(selectedBooking.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-semibold text-lg">${parseFloat(selectedBooking.totalAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Platform Commission</span>
                    <span>-${parseFloat(selectedBooking.commission).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 bg-primary/5 -mx-4 px-4 py-2">
                    <span className="font-bold text-lg">Your Earnings</span>
                    <span className="font-bold text-xl text-primary">
                      ${(parseFloat(selectedBooking.totalAmount) - parseFloat(selectedBooking.commission)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-muted-foreground">Deposit Amount</span>
                    <span className="font-medium">${parseFloat(selectedBooking.depositAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Cancellation Info */}
              {selectedBooking.status === 'cancelled' && selectedBooking.cancellationReason && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Cancellation Reason</h3>
                  <p className="text-sm">{selectedBooking.cancellationReason}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cancelled on: {selectedBooking.cancelledAt && new Date(selectedBooking.cancelledAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Booking Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to confirm this booking for {selectedBooking?.customerName}?
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-400">
              By confirming, you're agreeing to rent out your vehicle. The customer will be notified via email.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling this booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancel-reason">Cancellation Reason *</Label>
              <Textarea
                id="cancel-reason"
                placeholder="e.g., Vehicle maintenance required, personal emergency..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This will be sent to the customer
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={cancelBooking}
              disabled={!cancellationReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}