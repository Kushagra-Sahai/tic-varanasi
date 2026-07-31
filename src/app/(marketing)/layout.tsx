import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { FloatingActions, StickyBookingBar } from "@/components/marketing/FloatingActions";
import { COMPANY } from "@/lib/constants";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ticvaranasi.com";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: COMPANY.name,
  description: COMPANY.tagline,
  url: siteUrl,
  telephone: COMPANY.phones[0],
  email: COMPANY.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Varanasi",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  areaServed: ["Varanasi", "Sarnath", "Ayodhya", "Prayagraj"],
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1 pb-16 sm:pb-0">{children}</main>
      <SiteFooter />
      <FloatingActions />
      <StickyBookingBar />
    </>
  );
}
