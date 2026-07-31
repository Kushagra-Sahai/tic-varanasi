import "server-only";
import { db } from "@/lib/db";

export async function listPackages(options?: { featuredOnly?: boolean }) {
  return db.package.findMany({
    where: { isActive: true, isFeatured: options?.featuredOnly ? true : undefined },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ isFeatured: "desc" }, { title: "asc" }],
  });
}

export async function getPackageBySlug(slug: string) {
  return db.package.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      itinerary: { orderBy: { dayNumber: "asc" } },
      inclusions: true,
      exclusions: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
}

export async function listFeaturedPackages(take = 6) {
  return listPackages({ featuredOnly: true }).then((p) => p.slice(0, take));
}
