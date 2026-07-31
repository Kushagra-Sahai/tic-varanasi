import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { VehicleCard } from "@/components/marketing/VehicleCard";
import { listFeaturedVehicles } from "@/server/services/vehicleService";

export async function FleetPreview() {
  const vehicles = await listFeaturedVehicles(6);
  if (vehicles.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Our Fleet"
        title="Premium Vehicles for Every Journey"
        description="From city sedans to luxury coaches — a well-maintained fleet with professional drivers."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/car-rental">View Full Fleet</Link>
        </Button>
      </div>
    </section>
  );
}
