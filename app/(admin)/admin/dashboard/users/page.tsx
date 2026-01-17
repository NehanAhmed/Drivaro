// NO 'use client' here - stays server component
import { UserTable } from '@/components/admin/tables/user-table';
import { db } from '@/lib/db';
import { user } from '@/lib/db/schema';

async function getUsers() {
    const users = await db.select().from(user)
    return users;
}

export default async function UsersPage() {
    const users = await getUsers(); // Fetch on server

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className='text-2xl font-extrabold'>User Management</h1>
                <p>Manage all users</p>
            </div>

            {/* Just pass plain data */}
            <UserTable data={users} />
        </div>
    );
}