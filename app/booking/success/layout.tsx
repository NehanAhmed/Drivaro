import { IconLoader2 } from '@tabler/icons-react'
import React, { Suspense } from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
        <Suspense fallback={<div className='w-full min-h-screen justify-center items-center'>
            <IconLoader2 className='animate-spin m-auto' />
            
        </div>}>

            {children}
        </Suspense>
        </>
    )
}

export default Layout