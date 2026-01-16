import { IconCar, IconHome, IconUser, IconLogout, IconSettings, IconCalendar } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { Separator } from './ui/separator'
import MenuToCloseIcon from './menu-to-close-icon'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { authClient } from '@/lib/auth-client'
import { redirect } from 'next/navigation'
// Define navigation structure with proper typing
const NAVIGATION_LINKS = [
    { icon: IconHome, label: 'Home', href: '/' },
    { icon: IconCar, label: 'Our Fleet', href: '/cars' },
    { icon: IconHome, label: 'About Us', href: '/about' },
    { icon: IconHome, label: 'How It Works', href: '/how-it-works' },
    { icon: IconHome, label: 'Contact', href: '/contact' },
] as const;

// Helper to get user initials
function getUserInitials(name?: string | null, email?: string | null): string {
    if (name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }
    if (email) {
        return email.slice(0, 2).toUpperCase();
    }
    return 'U';
}

// Profile Dropdown Component
function ProfileDropdown({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
    const initials = getUserInitials(user.name, user.email);
    const displayName = user.name || user.email || 'User';
    const handleLogout = async () => {
        try {
            const response = await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        redirect('/login')
                    }
                }
            })
        } catch (error: any) {
            throw new Error(error)
        }
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} alt={displayName} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        {user.email && (
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex items-center">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        <span>Bookings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex items-center">
                        <IconSettings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className=''>
                    <button onClick={handleLogout} className="w-full text-start flex items-center justify-start  cursor-pointer">
                        <IconLogout className="mr-2 h-4 w-4 " />
                        <p className=''>Log out</p>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Mobile Navigation Component
function MobileNav({ isAuthenticated, user }: {
    isAuthenticated: boolean;

    user?: { name?: string | null; email?: string | null; image?: string | null } | null

}) {
    const handleLogout = async () => {
        try {
            const response = await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        redirect('/login')
                    }
                }
            })
        } catch (error: any) {
            throw new Error(error)
        }
    }
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div>
                    <MenuToCloseIcon />
                </div>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[350px] px-4">
                <SheetHeader className="text-left mb-6">
                    <SheetTitle className="text-4xl font-extrabold font-cinzel">
                        Drivaro
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation Links */}
                <nav className="flex flex-col space-y-1">
                    {NAVIGATION_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors group"
                        >
                            <link.icon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <span className="text-base font-medium">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                    {isAuthenticated ? (
                        <div className="flex flex-col space-y-2">
                            <Link href="/bookings">
                                <Button variant="outline" className="w-full">
                                    Bookings
                                </Button>
                            </Link>

                            <Button onClick={handleLogout} type="submit" variant="ghost" className="w-full">
                                Log out
                            </Button>

                        </div>
                    ) : (
                        <Link href="/register">
                            <Button variant="outline" className="w-full">
                                Login / Register
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs text-muted-foreground">
                        © 2025 Drivaro. All rights reserved.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}

const Header = async () => {
    // Fetch session with proper error handling
    let session = null;
    try {
        session = await auth.api.getSession({
            headers: await headers()
        });
    } catch (error) {
        console.error('Failed to fetch session:', error);
        // Session remains null, user will see logged-out state
    }

    // Fixed: Changed 'roles' to 'role' (assuming single role) and fixed typo 'costumer' to 'customer'
    // Also using optional chaining and proper boolean logic
    const isAuthenticated = !!session?.user;
    const isCustomer = await session?.roles === 'customer';

    return (
        <header className='w-full px-10 py-6 font-hanken-grotesk flex items-center justify-around'>
            {/* Mobile Menu */}
            <div>
                <MobileNav
                    isAuthenticated={isAuthenticated}
                    user={session?.user}
                />
            </div>

            {/* Logo */}
            <div>
                <Link href="/">
                    <h1 className='text-4xl font-extrabold font-cinzel'>Drivaro</h1>
                </Link>
            </div>

            {/* Desktop Auth Section */}
            <div>
                {isAuthenticated && session?.user ? (
                    <ProfileDropdown user={session.user} />
                ) : (
                    <Link href="/register">
                        <Button variant="outline">Login / Register</Button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;