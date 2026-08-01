import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Package } from "@/lib/entities";

function sortImages<T extends Package>(pkg: T): T {
  return { ...pkg, images: [...pkg.images].sort((a, b) => a.sortOrder - b.sortOrder) };
}

export async function listPackages(options?: { featuredOnly?: boolean }) {
  const packages = await readCollection<Package>("packages");
  const filtered = packages.filter((p) => p.isActive && (!options?.featuredOnly || p.isFeatured));

  filtered.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return filtered.map(sortImages);
}

export async function getPackageBySlug(slug: string) {
  const packages = await readCollection<Package>("packages");
  const pkg = packages.find((p) => p.slug === slug && p.isActive);
  if (!pkg) return null;

  return {
    ...sortImages(pkg),
    itinerary: [...pkg.itinerary].sort((a, b) => a.dayNumber - b.dayNumber),
  };
}

export async function listFeaturedPackages(take = 6) {
  return listPackages({ featuredOnly: true }).then((p) => p.slice(0, take));
}

/** Admin panel: every package regardless of active/featured status. */
export async function listAllPackagesForAdmin() {
  const packages = await readCollection<Package>("packages");
  const sorted = [...packages].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sorted.map(sortImages);
}
