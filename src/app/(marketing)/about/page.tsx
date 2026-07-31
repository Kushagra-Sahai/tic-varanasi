import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Users, MapPinned, Clock } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { getSettings } from "@/server/services/settingsService";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Travel Info Centre (TIC) has served travellers in Varanasi for over 25 years with trusted car rentals, pilgrimage tours and corporate travel.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Trusted Since Day One",
    description: "25+ years of serving pilgrims, families and corporate clients across Varanasi.",
  },
  {
    icon: Users,
    title: "Local Expertise",
    description: "Our drivers and guides are local, verified, and deeply familiar with every sacred route.",
  },
  {
    icon: MapPinned,
    title: "Complete Coverage",
    description: "Varanasi, Sarnath, Ayodhya, Prayagraj, Vindhyachal, Chunar, Bodh Gaya and beyond.",
  },
  {
    icon: Clock,
    title: "24×7 Support",
    description: "Round-the-clock assistance for bookings, changes and on-trip support.",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-slate py-20 text-white">
        <Image
          src="https://picsum.photos/seed/tic-about-hero/1920/700"
          alt="Varanasi ghats"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">About Travel Info Centre</h1>
          <p className="mt-4 text-lg text-slate-200">
            Your Trusted Travel Partner – {settings.yearsInService}+ Years of Trusted Service
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          align="left"
          eyebrow="Our Story"
          title="Rooted in Varanasi, Trusted Nationwide"
        />
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            For over {settings.yearsInService} years, Travel Info Centre (TIC) has been the trusted
            travel partner for pilgrims, families and corporate travellers visiting the eternal
            city of Varanasi. What began as a small car rental service has grown into a full
            travel company offering vehicle rentals, curated pilgrimage tours, corporate travel
            management, hotel assistance and government-approved guide services.
          </p>
          <p>
            We understand that a journey to Kashi is more than travel — it is a deeply personal,
            spiritual experience. That is why every vehicle in our fleet is well-maintained, every
            driver is locally experienced and courteous, and every itinerary is planned with care
            for comfort, safety and authenticity.
          </p>
          <p>
            Today, TIC serves thousands of travellers each year across Varanasi, Sarnath, Ayodhya,
            Prayagraj and the wider pilgrimage circuit of Uttar Pradesh — backed by 24×7 support
            and a promise of reliability that has never wavered.
          </p>
        </div>
      </section>

      <section className="bg-brand-grey/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Why Choose Us" title="What Sets TIC Apart" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-brand-royal/10 text-brand-royal">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-4 font-heading font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
