import { 
    CarFront, 
    Home, 
    Info, 
    Phone, 
    CalendarCheck, 
    Settings, 
    LogOut, 
    User, 
    Menu, 
    X,
    LayoutDashboard,
    LayoutGrid
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
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
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import LogoutButton from './logoutButton'

// Navigation Configuration
const NAVIGATION_LINKS = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: CarFront, label: 'The Fleet', href: '/cars' },
    { icon: Info, label: 'About', href: '/about' },
    { icon: Phone, label: 'Contact', href: '/contact' },
] as const;

// Helper: Get User Initials
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

// Component: Profile Dropdown
// ADDED: role prop to handle conditional rendering
function ProfileDropdown({ user, role }: { 
    user: { name?: string | null; email?: string | null; image?: string | null };
    role?: string;
}) {
    const initials = getUserInitials(user.name, user.email);
    const displayName = user.name || 'Valued Client';
    const isVendor = role === 'vendor';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0">
                    <Avatar className="h-10 w-10 border border-border transition-all hover:border-accent">
                        <AvatarImage src={user.image || undefined} alt={displayName} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-cinzel font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-3 bg-secondary/30 rounded-md mb-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none font-cinzel text-foreground">{displayName}</p>
                        <p className="text-[10px] font-bold text-accent uppercase tracking-tighter">{role}</p>
                    </div>
                </DropdownMenuLabel>
                
                {/* VENDOR VIEW: Show Dashboard */}
                {isVendor ? (
                    <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-accent/10 focus:text-accent font-medium">
                        <Link href="/vendor/dashboard" className="flex items-center">
                            <LayoutGrid className="mr-3 h-4 w-4" />
                            <span>Vendor Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                ) : (
                    /* CUSTOMER VIEW: Show Bookings & Settings */
                    <>
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-accent/10 focus:text-accent">
                            <Link href="/bookings" className="flex items-center">
                                <CalendarCheck className="mr-3 h-4 w-4" />
                                <span>My Bookings</span>
                            </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild className="cursor-pointer py-2.5 focus:bg-accent/10 focus:text-accent">
                            <Link href="/settings" className="flex items-center">
                                <Settings className="mr-3 h-4 w-4" />
                                <span>Account Settings</span>
                            </Link>
                        </DropdownMenuItem>
                    </>
                )}
                
                <DropdownMenuSeparator className="my-2" />
                
                <div className="px-2">
                    <LogoutButton />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Component: Mobile Navigation
function MobileNav({ isAuthenticated, role }: { isAuthenticated: boolean; role?: string }) {
    const isVendor = role === 'vendor';

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-transparent">
                    <Menu className="h-6 w-6" strokeWidth={1.5} />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[300px] border-r border-border bg-background/95 backdrop-blur-xl p-0">
                <SheetHeader className="p-6 text-left border-b border-border/50">
                    <SheetTitle className="text-3xl font-bold font-cinzel tracking-tight">
                        DRIVARO<span className="text-accent">.</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full py-6 px-4">
                    <nav className="flex flex-col space-y-1">
                        {NAVIGATION_LINKS.map((link) => (
                            <SheetClose key={link.href} asChild>
                                <Link
                                    href={link.href}
                                    className="flex items-center gap-4 px-4 py-4 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-300 font-hanken-grotesk group"
                                >
                                    <link.icon className="h-5 w-5 text-accent/70 group-hover:text-accent transition-colors" />
                                    <span className="text-base font-medium tracking-wide">{link.label}</span>
                                </Link>
                            </SheetClose>
                        ))}
                    </nav>

                    <div className="mt-auto pb-8 space-y-4">
                        <div className="h-[1px] w-full bg-border/50 mb-4" />
                        
                        {isAuthenticated ? (
                            <div className="space-y-3 px-2">
                                <SheetClose asChild>
                                    {/* Conditional link for Mobile Dashboard */}
                                    <Link href={isVendor ? "/vendor/dashboard" : "/bookings"}>
                                        <Button variant="outline" className="w-full justify-start gap-3 h-12 border-primary/20 hover:border-primary/50">
                                            <LayoutDashboard className="h-4 w-4" />
                                            {isVendor ? 'Vendor Panel' : 'My Bookings'}
                                        </Button>
                                    </Link>
                                </SheetClose>
                                <LogoutButton />
                            </div>
                        ) : (
                            <div className="px-2">
                                <SheetClose asChild>
                                    <Link href="/login">
                                        <Button className="w-full h-12 bg-primary text-primary-foreground font-cinzel tracking-wide shadow-lg shadow-primary/20">
                                            Sign In / Register
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// Desktop Nav (Hidden on Mobile)
function DesktopNav() {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-hanken-grotesk tracking-wide"
                >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
            ))}
        </nav>
    );
}

// Main Header Component
const Header = async () => {
    let session = null;
    try {
        const reqHeaders = await headers();
        session = await auth.api.getSession({
            headers: reqHeaders
        });
    } catch (error) {
        console.error('Session fetch error:', error);
    }

    const isAuthenticated = !!session?.user;
    // Extracting role (adjust key based on your Auth implementation)
    const userRole = await session?.roles || (session as any)?.role || 'customer';
    
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                    <MobileNav 
                        isAuthenticated={isAuthenticated} 
                        role={userRole} 
                    />
                    
                    <Link href="/" className="flex items-center gap-2 group">
                        <h1 className="text-2xl md:text-3xl font-bold font-cinzel tracking-tight text-foreground transition-opacity hover:opacity-90">
                            DRIVARO<span className="text-accent group-hover:animate-pulse">.</span>
                        </h1>
                    </Link>
                </div>

                <DesktopNav />

                <div className="flex items-center gap-4">
                    {isAuthenticated && session?.user ? (
                        <div className="flex items-center gap-4">
                            <span className="hidden md:block text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {userRole === 'vendor' ? 'Vendor Portal' : `Welcome, ${session.user.name?.split(' ')[0]}`}
                            </span>
                            <ProfileDropdown user={session.user} role={userRole} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hidden md:block">
                                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-hanken-grotesk">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="h-10 px-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium tracking-wide shadow-md transition-all hover:scale-105">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;