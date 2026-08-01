import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Vehicle, VehicleCategory } from "@/lib/entities";

export async function listVehicleCategories() {
  const categories = await readCollection<VehicleCategory>("vehicleCategories");
  return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
}

async function withCategory<T extends Vehicle>(vehicles: T[]) {
  const categories = await readCollection<VehicleCategory>("vehicleCategories");
  const byId = new Map(categories.map((c) => [c.id, c]));
  return vehicles.map((v) => ({ ...v, category: byId.get(v.categoryId)! }));
}

export async function listVehicles(options?: { categorySlug?: string; featuredOnly?: boolean }) {
  const vehicles = await readCollection<Vehicle>("vehicles");
  const categories = await readCollection<VehicleCategory>("vehicleCategories");
  const categoryId = options?.categorySlug
    ? categories.find((c) => c.slug === options.categorySlug)?.id
    : undefined;

  const filtered = vehicles.filter((v) => {
    if (!v.isActive) return false;
    if (options?.featuredOnly && !v.isFeatured) return false;
    if (options?.categorySlug && v.categoryId !== categoryId) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const withImages = filtered.map((v) => ({
    ...v,
    images: [...v.images].sort((a, b) => a.sortOrder - b.sortOrder),
  }));

  return withCategory(withImages);
}

export async function getVehicleBySlug(slug: string) {
  const vehicles = await readCollection<Vehicle>("vehicles");
  const vehicle = vehicles.find((v) => v.slug === slug && v.isActive);
  if (!vehicle) return null;

  const [withCat] = await withCategory([
    { ...vehicle, images: [...vehicle.images].sort((a, b) => a.sortOrder - b.sortOrder) },
  ]);
  return withCat;
}

export async function listFeaturedVehicles(take = 6) {
  return listVehicles({ featuredOnly: true }).then((v) => v.slice(0, take));
}

/** Admin panel: every vehicle regardless of active/featured status. */
export async function listAllVehiclesForAdmin() {
  const vehicles = await readCollection<Vehicle>("vehicles");
  const sorted = [...vehicles].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const withImagesSorted = sorted.map((v) => ({
    ...v,
    images: [...v.images].sort((a, b) => a.sortOrder - b.sortOrder),
  }));
  return withCategory(withImagesSorted);
}
