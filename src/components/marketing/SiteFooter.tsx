import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";

const FOOTER_LINKS = {
  Explore: [
    { href: "/about", label: "About Us" },
    { href: "/car-rental", label: "Car Rental" },
    { href: "/tour-packages", label: "Tour Packages" },
    { href: "/destinations", label: "Destinations" },
    { href: "/book", label: "Book Now" },
  ],
  Company: [
    { href: "/faqs", label: "FAQs" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/terms-and-conditions", label: "Terms & Conditions" },
    { href: "/cancellation-policy", label: "Cancellation Policy" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-brand-slate text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <span className="font-heading text-2xl font-bold text-white">
              Travel Info Centre
            </span>
            <p className="mt-3 max-w-sm text-sm text-slate-400">{COMPANY.tagline}</p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold-light" />
                <span>{COMPANY.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-brand-gold-light" />
                <span>{COMPANY.phones.join(" · ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-brand-gold-light" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                  {COMPANY.email}
                </a>
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-brand-gold-light">
                {heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-slate-300 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Travel Info Centre (TIC), Varanasi. All rights
            reserved.
          </p>
          <p>25+ Years of Trusted Service · 24×7 Support</p>
        </div>
      </div>
    </footer>
  );
}
