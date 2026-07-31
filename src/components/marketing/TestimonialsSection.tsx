import { Star } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { db } from "@/lib/db";

export async function TestimonialsSection() {
  const testimonials = await db.testimonial.findMany({
    where: { isFeatured: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-brand-grey/60 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Travellers Say"
          description="Real experiences from families, solo travellers and corporate clients we've served."
        />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex gap-0.5 text-brand-gold">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4" fill="currentColor" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.message}&rdquo;
              </p>
              <p className="mt-4 font-heading text-sm font-semibold">{t.name}</p>
              {t.location && <p className="text-xs text-muted-foreground">{t.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
