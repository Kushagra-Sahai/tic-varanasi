import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Users, Briefcase, Fuel, Cog, Phone, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getVehicleBySlug } from "@/server/services/vehicleService";
import { COMPANY } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) return {};

  return {
    title: `${vehicle.name} Rental in Varanasi`,
    description: vehicle.description,
    alternates: { canonical: `/vehicles/${vehicle.slug}` },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicleBySlug(slug);
  if (!vehicle) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.name,
    description: vehicle.description,
    image: vehicle.images.map((i) => i.url),
    brand: { "@type": "Organization", name: COMPANY.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: Number(vehicle.basePrice),
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
        <Link href="/car-rental" className="hover:text-primary">
          Car Rental
        </Link>{" "}
        / <span className="text-foreground">{vehicle.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            {vehicle.images.map((image, i) => (
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
            <h2 className="font-heading text-xl font-semibold">About this vehicle</h2>
            <p className="mt-2 text-muted-foreground">{vehicle.description}</p>
          </div>

          {vehicle.features.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-semibold">Features</h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li key={f.id} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-brand-royal" /> {f.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-2xl font-bold">{vehicle.name}</h1>
              <Badge variant="secondary">{vehicle.category.name}</Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-muted-foreground" /> {vehicle.capacity} Passengers
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="size-4 text-muted-foreground" /> {vehicle.luggageCapacity}{" "}
                Bags
              </div>
              <div className="flex items-center gap-2">
                <Fuel className="size-4 text-muted-foreground" /> {vehicle.fuelType}
              </div>
              <div className="flex items-center gap-2">
                <Cog className="size-4 text-muted-foreground" /> {vehicle.transmission}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-brand-grey/70 p-4">
              <p className="text-xs text-muted-foreground">Base fare</p>
              <p className="font-heading text-2xl font-bold text-brand-royal">
                ₹{Number(vehicle.basePrice).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                + ₹{Number(vehicle.pricePerKm)}/km beyond included distance · GST extra
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Button asChild size="lg" className="bg-brand-gradient text-white hover:opacity-90">
                <Link href={`/book?vehicleId=${vehicle.id}`}>Book This Vehicle</Link>
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
                      `Hi, I'd like to book the ${vehicle.name}.`,
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
