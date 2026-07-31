import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-xl sm:px-12">
        <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <h2 className="relative font-heading text-3xl font-bold text-white sm:text-4xl">
          Plan Your Varanasi Journey Today
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/90">
          Speak with our travel experts for a customised itinerary, or book instantly online.
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="bg-white text-brand-royal hover:bg-white/90">
            <Link href="/book">Book Now</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            <a href={`tel:${COMPANY.primaryPhone}`}>Call {COMPANY.primaryPhone}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
