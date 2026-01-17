// app/admin/vendors/page.tsx (Server Component)

import { VendorTable } from "@/components/admin/tables/vendor-table";
import { db } from "@/lib/db";
import { vendor } from "@/lib/db/schema";


async function getVendors() {
  const vendors = await db.select().from(vendor)
  return vendors
}


export default async function VendorsPage() {
  const vendors = await getVendors(); // Fetch on server

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Vendor Management</h1>
        <p>Manage all Vendors present on your platform and manage them.</p>
      </div>

      {/* Just pass plain data */}
      <VendorTable data={vendors} />
    </div>
  )
}