// components/admin/vendor-approvals.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, CheckCircle2, XCircle, Mail, Car, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Vendor {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  submittedDate: string;
  carsCount: number;
}

interface VendorApprovalsProps {
  vendors: Vendor[];
}

export function VendorApprovals({ vendors }: VendorApprovalsProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const handleApprove = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    console.log('Approving vendor:', selectedVendor);
    setIsApproveDialogOpen(false);
    setSelectedVendor(null);
  };

  const confirmReject = () => {
    console.log('Rejecting vendor:', selectedVendor, 'Reason:', rejectReason);
    setIsRejectDialogOpen(false);
    setSelectedVendor(null);
    setRejectReason('');
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Vendor Approvals</CardTitle>
              <CardDescription>Review and approve vendor applications</CardDescription>
            </div>
            <Badge variant="destructive" className="text-sm">
              {vendors.length} Pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-4 rounded-lg border border-border/50 hover:border-accent/50 transition-all hover:shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{vendor.businessName}</p>
                      <p className="text-sm text-muted-foreground">{vendor.ownerName}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Car className="h-4 w-4" />
                    <span>{vendor.carsCount} vehicles</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted {new Date(vendor.submittedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleApprove(vendor)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-destructive hover:bg-destructive/10"
                    onClick={() => handleReject(vendor)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Vendor Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedVendor?.businessName}? They will be notified via email and can start listing their vehicles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Vendor Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedVendor?.businessName}'s application. This will be sent to them via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}