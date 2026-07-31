import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase } from "lucide-react";
import type { Decimal } from "@prisma/client/runtime/library";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type VehicleCardData = {
  slug: string;
  name: string;
  capacity: number;
  luggageCapacity: number;
  basePrice: number | string | Decimal;
  pricePerKm: number | string | Decimal;
  isFeatured: boolean;
  category: { name: string };
  images: { url: string; alt: string }[];
};

export function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const primaryImage = vehicle.images[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {primaryImage && (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {vehicle.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-brand-gold text-brand-slate">
            Popular
          </Badge>
        )}
        <Badge variant="secondary" className="absolute right-3 top-3">
          {vehicle.category.name}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold">{vehicle.name}</h3>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-4" /> {vehicle.capacity} Seats
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="size-4" /> {vehicle.luggageCapacity} Bags
          </span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Starting at</p>
            <p className="font-heading text-xl font-bold text-brand-royal">
              ₹{Number(vehicle.basePrice).toLocaleString("en-IN")}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                + ₹{Number(vehicle.pricePerKm)}/km
              </span>
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/vehicles/${vehicle.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
