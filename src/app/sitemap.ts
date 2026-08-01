import type { MetadataRoute } from "next";
import { listVehicles } from "@/server/services/vehicleService";
import { listPackages } from "@/server/services/packageService";
import { listDestinations } from "@/server/services/destinationService";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ticvaranasi.com";

const STATIC_ROUTES = [
  "",
  "/about",
  "/car-rental",
  "/tour-packages",
  "/destinations",
  "/faqs",
  "/contact",
  "/privacy-policy",
  "/refund-policy",
  "/terms-and-conditions",
  "/cancellation-policy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, packages, destinations] = await Promise.all([
    listVehicles(),
    listPackages(),
    listDestinations(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const vehicleEntries: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${siteUrl}/vehicles/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const packageEntries: MetadataRoute.Sitemap = packages.map((p) => ({
    url: `${siteUrl}/tour-packages/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const destinationEntries: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${siteUrl}/destinations/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...vehicleEntries, ...packageEntries, ...destinationEntries];
}
