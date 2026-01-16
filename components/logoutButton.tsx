'use client'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import { IconLogout } from '@tabler/icons-react'

const LogoutButton = ({ shadcn }: { shadcn?: boolean }) => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/login')
                    }
                }
            })
        } catch (error: any) {
            throw new Error(error)
        }
    }
    
    return shadcn ? (
        <Button onClick={handleLogout} variant="ghost" className="w-full">
            Log out
        </Button>
    ) : (
        <button onClick={handleLogout} className="w-full text-start flex items-center justify-start cursor-pointer">
            <IconLogout className="mr-2 h-4 w-4" />
            <p className='ml-2'>Log out</p>
        </button>
    )
}

export default LogoutButton 