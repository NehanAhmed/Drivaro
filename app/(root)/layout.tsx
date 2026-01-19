import Footer from '@/components/footer'
import Header from '@/components/header'
import DrivaroPreloader from '@/components/preloader'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <DrivaroPreloader />
            <Header />

            {children}
            <Footer />
        </>
    )
}

export default Layout