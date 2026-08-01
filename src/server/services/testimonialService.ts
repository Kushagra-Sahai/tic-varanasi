import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Testimonial } from "@/lib/entities";

export async function listFeaturedTestimonials(take = 6) {
  const testimonials = await readCollection<Testimonial>("testimonials");
  return testimonials
    .filter((t) => t.isFeatured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, take);
}
