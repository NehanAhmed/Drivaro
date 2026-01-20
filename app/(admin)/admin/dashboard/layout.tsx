export const dynamic = 'force-dynamic'

import { AppSidebar } from "@/components/app-sidebar-admin"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const Layout = async ({ children }: { children: React.ReactNode }) => {
    // Get session
    const session = await auth.api.getSession({
        headers: await headers()
    })

    // Check if user is authenticated
    if (!session?.session) {
        redirect('/login') // Redirect to login instead of home
    }

    // Check if user has admin role
    const role = await session.roles // Remove await - roles is not a promise
    if (role !== 'admin') {
        redirect('/') // Or redirect to unauthorized page
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

export default Layout