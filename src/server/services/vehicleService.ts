import "server-only";
import { db } from "@/lib/db";

export async function listVehicleCategories() {
  return db.vehicleCategory.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function listVehicles(options?: { categorySlug?: string; featuredOnly?: boolean }) {
  return db.vehicle.findMany({
    where: {
      isActive: true,
      isFeatured: options?.featuredOnly ? true : undefined,
      category: options?.categorySlug ? { slug: options.categorySlug } : undefined,
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
  });
}

export async function getVehicleBySlug(slug: string) {
  return db.vehicle.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      features: true,
      pricingRules: true,
    },
  });
}

export async function listFeaturedVehicles(take = 6) {
  return listVehicles({ featuredOnly: true }).then((v) => v.slice(0, take));
}
