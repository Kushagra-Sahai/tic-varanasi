import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, Check, X, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPackageBySlug } from "@/server/services/packageService";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return {};

  return {
    title: pkg.title,
    description: pkg.summary,
    alternates: { canonical: `/tour-packages/${pkg.slug}` },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const displayPrice = Number(pkg.discountPrice ?? pkg.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.summary,
    image: pkg.images.map((i) => i.url),
    provider: { "@type": "Organization", name: COMPANY.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: displayPrice,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/tour-packages" className="hover:text-primary">
          Tour Packages
        </Link>{" "}
        / <span className="text-foreground">{pkg.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {pkg.images.map((image, i) => (
              <div
                key={image.id}
                className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ${
                  i === 0 ? "col-span-2 sm:col-span-4 lg:col-span-2" : ""
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-xl font-semibold">Overview</h2>
            <p className="mt-2 text-muted-foreground">{pkg.description}</p>
          </div>

          {pkg.itinerary.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold">Day-by-Day Itinerary</h2>
              <div className="mt-4 space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.id} className="flex gap-4 rounded-xl border border-border p-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-royal text-sm font-semibold text-white">
                      {day.dayNumber}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold">{day.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{day.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {pkg.inclusions.length > 0 && (
              <div>
                <h2 className="font-heading text-lg font-semibold">Inclusions</h2>
                <ul className="mt-3 space-y-2">
                  {pkg.inclusions.map((inc) => (
                    <li key={inc.id} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-green-600" /> {inc.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.exclusions.length > 0 && (
              <div>
                <h2 className="font-heading text-lg font-semibold">Exclusions</h2>
                <ul className="mt-3 space-y-2">
                  {pkg.exclusions.map((exc) => (
                    <li key={exc.id} className="flex items-center gap-2 text-sm">
                      <X className="size-4 shrink-0 text-destructive" /> {exc.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h1 className="font-heading text-2xl font-bold leading-snug">{pkg.title}</h1>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="size-3.5" />
                {pkg.durationDays}D / {pkg.durationNights}N
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="size-3.5" />
                Up to {pkg.maxGroupSize}
              </Badge>
            </div>

            <div className="mt-6 rounded-xl bg-brand-grey/70 p-4">
              <p className="text-xs text-muted-foreground">Package price (per person)</p>
              <p className="font-heading text-2xl font-bold text-brand-royal">
                ₹{displayPrice.toLocaleString("en-IN")}
                {pkg.discountPrice != null && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground line-through">
                    ₹{Number(pkg.price).toLocaleString("en-IN")}
                  </span>
                )}
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button asChild size="lg" className="bg-brand-gradient text-white hover:opacity-90">
                <Link href={`/book?packageId=${pkg.id}`}>Book This Package</Link>
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline">
                  <a href={`tel:${COMPANY.primaryPhone}`}>
                    <Phone className="size-4" /> Call
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a
                    href={`https://wa.me/91${COMPANY.primaryPhone}?text=${encodeURIComponent(
                      `Hi, I'd like to know more about ${pkg.title}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
