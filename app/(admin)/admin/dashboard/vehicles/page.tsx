import { VehiclesTable } from '@/components/admin/tables/vehicle-table';
import { db } from '@/lib/db';
import { car } from '@/lib/db/schema';

async function getVehicles() {
  const vehicles = await db.select().from(car)

  return vehicles;
}


export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === 'available').length,
    rented: vehicles.filter((v) => v.status === 'rented').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className='text-2xl font-extrabold'>Vehicle Management</h1>
        <p>Manage all vehicles present and registeres up on your platform.</p>
      </div>

      {/* Just pass plain data */}
      <VehiclesTable data={vehicles} />
    </div>
  );
}