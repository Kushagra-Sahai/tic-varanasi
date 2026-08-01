import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type PackageCardData = {
  slug: string;
  title: string;
  summary: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number | null;
  isFeatured: boolean;
  images: { url: string; alt: string }[];
};

export function PackageCard({ pkg }: { pkg: PackageCardData }) {
  const primaryImage = pkg.images[0];
  const hasDiscount = pkg.discountPrice != null;

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
        {pkg.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-brand-gold text-brand-slate">
            Bestseller
          </Badge>
        )}
        <Badge variant="secondary" className="absolute right-3 top-3 flex items-center gap-1">
          <Clock className="size-3" />
          {pkg.durationDays}D / {pkg.durationNights}N
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug">{pkg.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{pkg.summary}</p>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Package price</p>
            <p className="font-heading text-xl font-bold text-brand-royal">
              ₹{Number(pkg.discountPrice ?? pkg.price).toLocaleString("en-IN")}
              {hasDiscount && (
                <span className="ml-1.5 text-sm font-normal text-muted-foreground line-through">
                  ₹{Number(pkg.price).toLocaleString("en-IN")}
                </span>
              )}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/tour-packages/${pkg.slug}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
