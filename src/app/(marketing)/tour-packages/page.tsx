import type { Metadata } from "next";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PackageCard } from "@/components/marketing/PackageCard";
import { listPackages } from "@/server/services/packageService";

export const metadata: Metadata = {
  title: "Tour Packages | Kashi, Sarnath, Ayodhya & Prayagraj Pilgrimage Tours",
  description:
    "Explore curated pilgrimage and sightseeing tour packages across Varanasi, Sarnath, Ayodhya and Prayagraj with TIC — vehicle, guide and hotel handled for you.",
  alternates: { canonical: "/tour-packages" },
};

export default async function TourPackagesPage() {
  const packages = await listPackages();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Tour Packages"
        title="Plan Your Pilgrimage & Sightseeing Journey"
        description="Every package includes transport, guide assistance and a day-by-day itinerary — fully customisable on request."
      />
      {packages.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          No packages published yet. Please check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
}
