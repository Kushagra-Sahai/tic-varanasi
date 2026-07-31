import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { ContactForm } from "@/components/marketing/ContactForm";
import { getSettings } from "@/server/services/settingsService";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Travel Info Centre (TIC) Varanasi for car rentals, tour packages and corporate travel enquiries.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Contact Us"
        title="Get In Touch"
        description="Our team responds to every enquiry within a few hours — call, WhatsApp or write to us."
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-brand-royal" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">{settings.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="mt-1 size-5 shrink-0 text-brand-royal" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {settings.landline} · {settings.phonePrimary} · {settings.phoneSecondary}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="mt-1 size-5 shrink-0 text-brand-royal" />
              <div>
                <p className="font-medium">Email</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-border">
            <iframe
              title="TIC Varanasi Location"
              src="https://www.google.com/maps?q=Varanasi,Uttar%20Pradesh,India&output=embed"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
