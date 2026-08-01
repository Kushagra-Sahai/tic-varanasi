import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Destination } from "@/lib/entities";

export async function listDestinations(options?: { take?: number }) {
  const destinations = await readCollection<Destination>("destinations");
  const active = destinations.filter((d) => d.isActive);
  return options?.take ? active.slice(0, options.take) : active;
}

export async function getDestinationBySlug(slug: string) {
  const destinations = await readCollection<Destination>("destinations");
  return destinations.find((d) => d.slug === slug && d.isActive) ?? null;
}
