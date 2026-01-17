import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { IconBug, IconCalendar, IconCar, IconHome, IconPaperclip, IconReport, IconSettings, IconUser } from "@tabler/icons-react"
import Link from "next/link"

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: IconHome,
    },
    {
        title: "Bookings",
        url: "/admin/dashboard/bookings",
        icon: IconCalendar,
    },
    {
        title: "Vendors",
        url: "/admin/dashboard/vendors",
        icon: IconUser,
    },
    {
        title: "Users",
        url: "/admin/dashboard/users",
        icon: IconUser,
    },
    {
        title: "Vehicles",
        url: "/admin/dashboard/vehicles",
        icon: IconCar,
    },
    {
        title: "Documents",
        url: "/admin/dashboard/documents",
        icon: IconPaperclip,
    },

]

const navFooter = [
    {
        title: "Settings",
        url: "/admin/dashboard/settings",
        icon: IconSettings,
    },
    {
        title: "Reports",
        url: "/admin/dashboard/reports",
        icon: IconReport,
    },


]

export function AppSidebar() {
    return (
        <Sidebar variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="px-2 py-2">

                        <Link href="/vendor/dashboard">
                            <span className="font-cinzel text-2xl font-extrabold">Drivaro</span>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu >
                    {navFooter.map((val) => (
                        <Link href={val.url} key={val.title}>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <val.icon />
                                    <span>{val.title}</span></SidebarMenuButton>
                            </SidebarMenuItem>
                        </Link>
                    ))}
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}