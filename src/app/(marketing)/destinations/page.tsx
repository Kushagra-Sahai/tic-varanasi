import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Destinations",
  description: "Explore Varanasi, Sarnath, Ayodhya and Prayagraj with Travel Info Centre.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const destinations = await db.destination.findMany({ where: { isActive: true } });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Destinations"
        title="Places We Cover"
        description="Every sacred city on the pilgrimage circuit, planned and driven by locals who know it best."
      />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((dest) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-muted">
              <Image
                src={`https://picsum.photos/seed/${dest.slug}-dest/600/450`}
                alt={dest.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-heading text-lg font-semibold">{dest.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{dest.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
