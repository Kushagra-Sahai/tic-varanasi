import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { listVehicles } from "@/server/services/vehicleService";
import { listPackages } from "@/server/services/packageService";

export const metadata: Metadata = {
  title: "Book Your Trip",
  robots: { index: false, follow: false },
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string; packageId?: string }>;
}) {
  const { vehicleId, packageId } = await searchParams;
  const [vehicles, packages] = await Promise.all([listVehicles(), listPackages()]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <h1 className="font-heading text-3xl font-bold">Book Your Trip</h1>
      <p className="mt-2 text-muted-foreground">
        Fill in your trip details below — our team confirms every booking within minutes.
      </p>
      <div className="mt-8">
        <BookingWizard
          vehicles={vehicles.map((v) => ({
            id: v.id,
            slug: v.slug,
            name: v.name,
            basePrice: Number(v.basePrice),
            pricePerKm: Number(v.pricePerKm),
            category: { name: v.category.name },
            images: v.images.slice(0, 1),
          }))}
          packages={packages.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            price: Number(p.price),
            discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
            images: p.images.slice(0, 1),
          }))}
          preselectedVehicleId={vehicleId}
          preselectedPackageId={packageId}
        />
      </div>
    </div>
  );
}
