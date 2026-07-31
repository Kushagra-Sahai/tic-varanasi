import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { PackageCard } from "@/components/marketing/PackageCard";
import { listFeaturedPackages } from "@/server/services/packageService";

export async function PackagesPreview() {
  const packages = await listFeaturedPackages(6);
  if (packages.length === 0) return null;

  return (
    <section className="bg-brand-grey/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Tour Packages"
          title="Curated Pilgrimage & Sightseeing Tours"
          description="Kashi Vishwanath, Sarnath, Ayodhya, Prayagraj — thoughtfully planned circuits with everything handled for you."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/tour-packages">View All Packages</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
