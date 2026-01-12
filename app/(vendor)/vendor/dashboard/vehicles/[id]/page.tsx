import React, { Suspense } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
    return (
        <Suspense>

        <div>
            
        </div>
        </Suspense>
    )
}

export default Page