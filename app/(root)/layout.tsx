import Footer from '@/components/footer'
import Header from '@/components/header'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
      <Header />

        {children}
        <Footer />
        </>
    )
}

export default Layout