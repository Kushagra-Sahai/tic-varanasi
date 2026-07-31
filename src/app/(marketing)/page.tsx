import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { StatsBand } from "@/components/marketing/StatsBand";
import { FleetPreview } from "@/components/marketing/FleetPreview";
import { PackagesPreview } from "@/components/marketing/PackagesPreview";
import { DestinationsStrip } from "@/components/marketing/DestinationsStrip";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { CtaBand } from "@/components/marketing/CtaBand";

export const metadata: Metadata = {
  title: "Trusted Travel Partner in Varanasi",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />
      <FleetPreview />
      <PackagesPreview />
      <DestinationsStrip />
      <TestimonialsSection />
      <CtaBand />
    </>
  );
}
