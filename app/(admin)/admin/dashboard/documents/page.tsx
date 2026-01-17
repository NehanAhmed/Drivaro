// app/admin/documents/page.tsx (Server Component)

import { DocumentTable } from '@/components/admin/tables/document-table'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react'
import { db } from '@/lib/db'
import { document, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

// Alias table for verifier join
const verifier = alias(user, 'verifier')

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type AdminDocument = {
    id: string
    userId: string
    type: 'drivers_license' | 'national_id' | 'proof_of_address'
    documentUrl: string
    status: 'pending' | 'verified' | 'rejected'
    verifiedAt: Date | null
    verifiedBy: string | null
    expiryDate: Date | null
    createdAt: Date

    // User (owner)
    userName: string
    userEmail: string
    userImage: string | null

    // Verifier (admin)
    verifierName: string
    verifierEmail: string | null
}

// -----------------------------------------------------------------------------
// Data Fetch
// -----------------------------------------------------------------------------

async function getDocuments(): Promise<AdminDocument[]> {
    const rows = await db
        .select({
            id: document.id,
            userId: document.userId,
            type: document.type,
            documentUrl: document.documentUrl,
            status: document.status,
            verifiedAt: document.verifiedAt,
            verifiedBy: document.verifiedBy,
            expiryDate: document.expiryDate,
            createdAt: document.createdAt,

            userName: user.name,
            userEmail: user.email,
            userImage: user.image,

            // These will now correctly reference the aliased table
            verifierName: verifier.name,
            verifierEmail: verifier.email,
        })
        .from(document)
        .leftJoin(user, eq(document.userId, user.id))
        .leftJoin(verifier, eq(document.verifiedBy, verifier.id))

    /**
     * Normalize nullable joins to satisfy strict UI types.
     * This prevents:
     *  - string | null → string
     *  - undefined rendering bugs
     */
    return rows.map(row => ({
        id: row.id,
        userId: row.userId,
        type: row.type,
        documentUrl: row.documentUrl,
        status: row.status,
        verifiedAt: row.verifiedAt,
        verifiedBy: row.verifiedBy,
        expiryDate: row.expiryDate,
        createdAt: row.createdAt,

        userName: row.userName ?? 'Unknown User',
        userEmail: row.userEmail ?? 'N/A',
        userImage: row.userImage ?? null,

        verifierName: row.verifierName ?? '—',
        verifierEmail: row.verifierEmail ?? null,
    }))
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default async function DocumentsPage() {
    const documents = await getDocuments()

    // Stats
    const stats = {
        total: documents.length,
        pending: documents.filter(d => d.status === 'pending').length,
        verified: documents.filter(d => d.status === 'verified').length,
        rejected: documents.filter(d => d.status === 'rejected').length,
        expiringSoon: documents.filter(d => {
            if (!d.expiryDate) return false
            const days =
                (new Date(d.expiryDate).getTime() - Date.now()) /
                (1000 * 60 * 60 * 24)
            return days <= 30 && days > 0
        }).length,
    }

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                        Document Verification
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Review and verify user documents for identity confirmation
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-primary/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Documents</p>
                            <p className="text-2xl font-bold mt-1">{stats.total}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-yellow-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-yellow-500/10">
                            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pending Review</p>
                            <p className="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">
                                {stats.pending}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-green-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-green-500/10">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Verified</p>
                            <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
                                {stats.verified}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-red-500/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-red-500/10">
                            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Rejected</p>
                            <p className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
                                {stats.rejected}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-border/50 hover:shadow-md transition-all hover:border-accent/30">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-accent/10">
                            <AlertCircle className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Expiring Soon</p>
                            <p className="text-2xl font-bold mt-1 text-accent">
                                {stats.expiringSoon}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Document Type Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['drivers_license', 'national_id', 'proof_of_address'].map(type => {
                    const typeCount = documents.filter(d => d.type === type).length
                    const typePending = documents.filter(
                        d => d.type === type && d.status === 'pending'
                    ).length

                    const typeLabels: Record<string, string> = {
                        drivers_license: "Driver's License",
                        national_id: 'National ID',
                        proof_of_address: 'Proof of Address',
                    }

                    return (
                        <Card key={type} className="p-4 border-border/50">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-semibold">{typeLabels[type]}</p>
                                {typePending > 0 && (
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                    >
                                        {typePending} pending
                                    </Badge>
                                )}
                            </div>
                            <p className="text-2xl font-bold text-primary">{typeCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total submitted
                            </p>
                        </Card>
                    )
                })}
            </div>

            {/* Documents Table */}
            <DocumentTable data={documents} />
        </div>
    )
}
