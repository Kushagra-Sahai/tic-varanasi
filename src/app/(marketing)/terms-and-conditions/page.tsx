import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updatedAt="31 July 2026">
      <p>
        These terms govern your use of the Travel Info Centre (TIC) website and services. By
        booking with us, you agree to the terms below.
      </p>
      <h2>Bookings</h2>
      <p>
        All bookings are subject to vehicle and driver availability. A booking is confirmed only
        after we contact you to verify trip details.
      </p>
      <h2>Pricing</h2>
      <p>
        Fares displayed include base fare, applicable distance charges and GST unless stated
        otherwise. Tolls, parking and state permits may be charged as actuals for outstation
        trips.
      </p>
      <h2>Passenger Responsibility</h2>
      <p>
        Passengers are responsible for carrying valid identification for pilgrimage sites and for
        complying with local regulations at each destination.
      </p>
      <h2>Liability</h2>
      <p>
        TIC is not liable for delays caused by weather, traffic, government restrictions or other
        circumstances beyond our reasonable control.
      </p>
      <h2>Governing Law</h2>
      <p>These terms are governed by the laws of India, with courts in Varanasi having jurisdiction.</p>
    </LegalPage>
  );
}
