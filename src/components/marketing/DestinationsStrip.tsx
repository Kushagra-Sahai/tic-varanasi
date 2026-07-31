import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { db } from "@/lib/db";

export async function DestinationsStrip() {
  const destinations = await db.destination.findMany({
    where: { isActive: true },
    take: 4,
  });
  if (destinations.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Destinations"
        title="Sacred Cities We Cover"
        description="Every route across Uttar Pradesh's most sacred circuit, planned and driven by locals."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {destinations.map((dest, i) => (
          <Link
            key={dest.id}
            href={`/destinations/${dest.slug}`}
            className="group relative aspect-3/4 overflow-hidden rounded-2xl"
          >
            <Image
              src={`https://picsum.photos/seed/${dest.slug}-dest/600/800`}
              alt={dest.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              priority={i === 0}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 font-heading text-lg font-semibold text-white">
              {dest.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
