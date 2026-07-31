import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = await db.destination.findUnique({ where: { slug } });
  if (!dest) return {};
  return { title: dest.name, description: dest.summary, alternates: { canonical: `/destinations/${dest.slug}` } };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = await db.destination.findUnique({ where: { slug, isActive: true } });
  if (!dest) notFound();

  return (
    <div>
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={`https://picsum.photos/seed/${dest.slug}-hero/1600/700`}
          alt={dest.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-4 sm:left-6 lg:left-8">
          <h1 className="font-heading text-4xl font-bold text-white">{dest.name}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-lg text-muted-foreground">{dest.summary}</p>
        <h2 className="mt-8 font-heading text-xl font-semibold">History & Significance</h2>
        <p className="mt-2 text-muted-foreground">{dest.history}</p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {dest.bestSeason && (
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">Best Season to Visit</p>
              <p className="mt-1 font-medium">{dest.bestSeason}</p>
            </div>
          )}
        </div>

        <div className="mt-10">
          <Button asChild size="lg" className="bg-brand-gradient text-white">
            <Link href="/tour-packages">Explore Tour Packages</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
