import { db } from "@/lib/db";
import { VehiclesManager } from "@/components/admin/VehiclesManager";

export default async function AdminVehiclesPage() {
  const [vehicles, categories] = await Promise.all([
    db.vehicle.findMany({
      include: { category: true, images: { orderBy: { sortOrder: "asc" } }, features: true },
      orderBy: { createdAt: "desc" },
    }),
    db.vehicleCategory.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Vehicles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your fleet — pricing, images and availability.
          </p>
        </div>
      </div>
      <div className="mt-6">
        <VehiclesManager
          vehicles={vehicles.map((v) => ({
            ...v,
            basePrice: Number(v.basePrice),
            pricePerKm: Number(v.pricePerKm),
            driverAllowance: Number(v.driverAllowance),
            nightCharge: Number(v.nightCharge),
          }))}
          categories={categories}
        />
      </div>
    </div>
  );
}
