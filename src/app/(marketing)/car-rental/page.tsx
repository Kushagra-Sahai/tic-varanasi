import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { VehicleCard } from "@/components/marketing/VehicleCard";
import { listVehicleCategories, listVehicles } from "@/server/services/vehicleService";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Car Rental in Varanasi | Sedans, SUVs, Tempo Traveller & Luxury Fleet",
  description:
    "Rent AC sedans, SUVs, Innova Crysta, Tempo Travellers, luxury cars and coaches in Varanasi with professional drivers. Transparent pricing, 24x7 support.",
  alternates: { canonical: "/car-rental" },
};

export default async function CarRentalPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [categories, vehicles] = await Promise.all([
    listVehicleCategories(),
    listVehicles({ categorySlug: category }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Car Rental"
        title="Our Complete Fleet"
        description="Sedans to luxury coaches — every vehicle comes with a verified, experienced driver."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/car-rental"
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !category
              ? "border-brand-royal bg-brand-royal text-white"
              : "border-border bg-background hover:bg-muted",
          )}
        >
          All Vehicles
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/car-rental?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === cat.slug
                ? "border-brand-royal bg-brand-royal text-white"
                : "border-border bg-background hover:bg-muted",
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {vehicles.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No vehicles available in this category right now. Please check back soon or call us at
          9795903030.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
