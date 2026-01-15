'use client'
import { IconCar, IconHome, IconMenu, IconUser } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { hover, motion } from 'motion/react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link'
import { Separator } from './ui/separator'
import { useState } from 'react'
import MenuToCloseIcon from './menu-to-close-icon'
const Header = () => {
    const MotionIconMenu = motion.create(IconMenu)
    const MotionButton = motion.create(Button)

    

    const [open, setOpen] = useState(false)

    const navigationLinks = [
        { icon: IconHome, label: 'Home', href: '/' },
        { icon: IconCar, label: 'Our Fleet', href: '/cars' },
        { icon: IconHome, label: 'About Us', href: '/about' },
        { icon: IconHome, label: 'How It Works', href: '/how-it-works' },
        { icon: IconHome, label: 'Contact', href: '/contact' },
    ];
    return (
        <header className='w-full px-10 py-6 font-hanken-grotesk flex items-center justify-around  '>

            <div>

                <Sheet>
                    <SheetTrigger asChild>
                        <div>
                            <motion.button initial="rest" whileHover="hover">
                                <MenuToCloseIcon />
                            </motion.button>
                        </div>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-[300px] sm:w-[350px] px-4">
                        <SheetHeader className="text-left mb-6">
                            <SheetTitle className="text-4xl font-extrabold font-cinzel ">
                                Drivaro
                            </SheetTitle>
                        </SheetHeader>

                        {/* Navigation Links */}
                        <nav className="flex flex-col space-y-1">
                            {navigationLinks.map((link, index) => (
                                <Link
                                    key={index}
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
                            <Link href="/register">
                                <Button variant={'outline'} className='w-full'>Login / Register</Button>
                            </Link>

                        </div>

                        {/* Footer Info */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-xs text-muted-foreground">
                                © 2025 Drivaro. All rights reserved.
                            </p>
                        </div>
                    </SheetContent>
                </Sheet>

            </div>
            <div>
                <Link href="/"><h1 className='text-4xl font-extrabold font-cinzel'>Drivaro</h1></Link>
            </div>
            <div>
                <Link href="/register"><Button variant={'outline'}>Login / Register</Button></Link>
            </div>
        </header>
    )
}






export default Header