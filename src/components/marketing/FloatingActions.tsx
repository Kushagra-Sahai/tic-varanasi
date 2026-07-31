import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { getSettings } from "@/server/services/settingsService";

export async function FloatingActions() {
  const settings = await getSettings();

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3 sm:bottom-6 sm:right-6">
      <a
        href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
          "Hi TIC! I'd like to know more about your travel packages.",
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        <MessageCircle className="size-6" fill="currentColor" />
      </a>
      <a
        href={`tel:${settings.phonePrimary}`}
        aria-label={`Call ${COMPANY.name}`}
        className="flex size-13 items-center justify-center rounded-full bg-brand-royal text-white shadow-lg shadow-black/20 transition-transform hover:scale-105"
      >
        <Phone className="size-5" />
      </a>
    </div>
  );
}

export function StickyBookingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,0,0,0.06)] sm:hidden">
      <Link
        href="/book"
        className="flex h-12 w-full items-center justify-center rounded-full bg-brand-gradient text-base font-semibold text-white shadow-md"
      >
        Book Now
      </Link>
    </div>
  );
}
