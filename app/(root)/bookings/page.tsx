import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const Page = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.session) {
        redirect('/login')
    } else if (await session.roles === 'vendor') {
        redirect('/')
    }


    return (
        <main>

        </main>
    )
}

export default Page