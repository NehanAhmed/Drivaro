export const dynamic = 'force-dynamic'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { getVendorIdByUserId } from "@/hooks/getVendorIdByUserId"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { vendor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Check user role
    if (await session?.roles === 'customer') {
        redirect('/')
    }

    // Validate user ID
    const userId = session?.session?.userId
    if (!userId) {
        redirect('/login')
    }

    // Get and validate vendor ID
    const vendorId = await getVendorIdByUserId(userId)
    if (!vendorId) {
        redirect('/')
    }

    // Get vendor data
    const vendors = await db.select().from(vendor).where(eq(vendor.id, vendorId))
    if (!vendors.length) {
        redirect('/')
    }
    const vendorData = vendors[0]

    // Handle pending approval
    if (vendorData.status === 'pending') {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Status indicator */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/20 bg-card">
                                <svg
                                    className="h-8 w-8 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-accent"></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Pending Approval
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Your vendor request has been submitted and is currently under review by our admin team.
                        </p>
                    </div>

                    {/* Info card */}
                    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                        <h2 className="text-sm font-medium text-foreground">What happens next?</h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                <span>Admin review typically takes 24-48 hours</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                <span>You'll receive an email notification once approved</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0"></span>
                                <span>You can close this page and check back later</span>
                            </li>
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Need help?{' '}
                            <a
                                href="/support"
                                className="font-medium text-primary hover:underline underline-offset-4 transition-colors"
                            >
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 px-2 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}