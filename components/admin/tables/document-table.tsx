// components/admin/tables/document-table.tsx
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
  FileText,
  Download,
  Calendar,
  User,
  AlertTriangle,
} from 'lucide-react';

interface Document {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  type: string;
  documentUrl: string;
  status: string;
  expiryDate: Date | null;
  createdAt: Date;
  verifiedAt: Date | null;
  verifiedBy: string | null;
  verifierName: string | null;
}

export function DocumentTable({ data }: { data: Document[] }) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleView = (doc: Document) => {
    setSelectedDoc(doc);
    setIsViewDialogOpen(true);
  };

  const handleVerify = (doc: Document) => {
    setSelectedDoc(doc);
    setIsVerifyDialogOpen(true);
  };

  const handleReject = (doc: Document) => {
    setSelectedDoc(doc);
    setIsRejectDialogOpen(true);
  };

  const confirmVerify = () => {
    console.log('Verifying document:', selectedDoc);
    setIsVerifyDialogOpen(false);
    setSelectedDoc(null);
  };

  const confirmReject = () => {
    console.log('Rejecting document:', selectedDoc, 'Reason:', rejectionReason);
    setIsRejectDialogOpen(false);
    setSelectedDoc(null);
    setRejectionReason('');
  };

  const documentColumns: Column<Document>[] = [
    {
      key: 'userName',
      label: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={row.userImage || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {value?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-sm text-muted-foreground">{row.userEmail}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Document Type',
      sortable: true,
      render: (value) => {
        const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
          drivers_license: {
            label: "Driver's License",
            icon: FileText,
            color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
          },
          national_id: {
            label: 'National ID',
            icon: User,
            color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
          },
          proof_of_address: {
            label: 'Proof of Address',
            icon: FileText,
            color: 'bg-green-500/10 text-green-700 dark:text-green-400',
          },
        };
        const config = typeConfig[value] || typeConfig.drivers_license;
        const Icon = config.icon;

        return (
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded ${config.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="font-medium">{config.label}</span>
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
            label: 'Pending Review',
            className: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
            icon: AlertTriangle,
          },
          verified: {
            label: 'Verified',
            className: 'bg-green-500/10 text-green-700 dark:text-green-400',
            icon: CheckCircle2,
          },
          rejected: {
            label: 'Rejected',
            className: 'bg-red-500/10 text-red-700 dark:text-red-400',
            icon: XCircle,
          },
        };
        const config = statusConfig[value] || statusConfig.pending;
        const Icon = config.icon;

        return (
          <div>
            <Badge variant="outline" className={`${config.className} mb-1`}>
              <Icon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
            {row.verifiedAt && (
              <p className="text-xs text-muted-foreground mt-1">
                by {row.verifierName || 'Unknown'}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: 'expiryDate',
      label: 'Expiry',
      sortable: true,
      render: (value) => {
        if (!value) {
          return <span className="text-muted-foreground text-sm">N/A</span>;
        }

        const expiryDate = new Date(value);
        const today = new Date();
        const daysUntilExpiry = Math.floor(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        const isExpired = daysUntilExpiry <= 0;

        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p
                className={`text-sm font-medium ${
                  isExpired
                    ? 'text-red-600 dark:text-red-400'
                    : isExpiringSoon
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : ''
                }`}
              >
                {expiryDate.toLocaleDateString()}
              </p>
              {isExpiringSoon && !isExpired && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  Expires in {daysUntilExpiry} days
                </p>
              )}
              {isExpired && (
                <p className="text-xs text-red-600 dark:text-red-400">Expired</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Submitted',
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

  const documentFilters: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'verified', label: 'Verified' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
    {
      key: 'type',
      label: 'Document Type',
      options: [
        { value: 'drivers_license', label: "Driver's License" },
        { value: 'national_id', label: 'National ID' },
        { value: 'proof_of_address', label: 'Proof of Address' },
      ],
    },
  ];

  const documentActions: Action<Document>[] = [
    {
      label: 'View Document',
      icon: Eye,
      onClick: handleView,
    },
    {
      label: 'Download',
      icon: Download,
      onClick: (row) => {
        window.open(row.documentUrl, '_blank');
      },
    },
    {
      label: 'Verify',
      icon: CheckCircle2,
      onClick: handleVerify,
      variant: 'success',
      show: (row) => row.status === 'pending',
    },
    {
      label: 'Reject',
      icon: XCircle,
      onClick: handleReject,
      variant: 'destructive',
      show: (row) => row.status === 'pending',
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={documentColumns}
        searchKey="userName"
        searchPlaceholder="Search by user name or email..."
        filters={documentFilters}
        actions={documentActions}
        emptyMessage="No documents found"
      />

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Review the submitted document and user information
            </DialogDescription>
          </DialogHeader>
          {selectedDoc && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={selectedDoc.userImage || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                    {selectedDoc.userName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{selectedDoc.userName}</p>
                  <p className="text-sm text-muted-foreground">{selectedDoc.userEmail}</p>
                </div>
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Document Type</Label>
                  <p className="font-medium mt-1 capitalize">
                    {selectedDoc.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge
                    variant="outline"
                    className={`mt-1 ${
                      selectedDoc.status === 'verified'
                        ? 'bg-green-500/10 text-green-700'
                        : selectedDoc.status === 'rejected'
                        ? 'bg-red-500/10 text-red-700'
                        : 'bg-yellow-500/10 text-yellow-700'
                    }`}
                  >
                    {selectedDoc.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted</Label>
                  <p className="font-medium mt-1">
                    {new Date(selectedDoc.createdAt).toLocaleString()}
                  </p>
                </div>
                {selectedDoc.expiryDate && (
                  <div>
                    <Label className="text-muted-foreground">Expiry Date</Label>
                    <p className="font-medium mt-1">
                      {new Date(selectedDoc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Document Preview */}
              <div>
                <Label className="text-muted-foreground mb-2 block">Document Preview</Label>
                <div className="border border-border rounded-lg p-4 bg-muted/20 min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Document preview not available
                    </p>
                    <Button
                      onClick={() => window.open(selectedDoc.documentUrl, '_blank')}
                      variant="outline"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify this document for {selectedDoc?.userName}?
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-700 dark:text-green-400">
              This will mark the document as verified and the user will be notified via
              email.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmVerify} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Verify Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedDoc?.userName}'s document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="e.g., Document is blurry, expired, or doesn't match the required format..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                This reason will be sent to the user via email
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}