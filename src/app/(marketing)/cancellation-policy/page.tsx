import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  alternates: { canonical: "/cancellation-policy" },
};

export default function CancellationPolicyPage() {
  return (
    <LegalPage title="Cancellation Policy" updatedAt="31 July 2026">
      <h2>City & Local Rides</h2>
      <p>Free cancellation up to 2 hours before the scheduled pickup time.</p>
      <h2>Outstation & Round Trips</h2>
      <p>
        Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a
        charge of up to 25% of the booking value to cover driver allocation costs.
      </p>
      <h2>Tour Packages</h2>
      <p>
        Cancellations made 7+ days before the tour start date receive a full refund of any
        advance paid, less applicable hotel/vendor cancellation charges. Cancellations within 7
        days may forfeit the advance amount.
      </p>
      <h2>No-Shows</h2>
      <p>Bookings where the customer does not show up at the pickup point are non-refundable.</p>
      <h2>How to Cancel</h2>
      <p>Call our support line or WhatsApp us with your booking number to cancel a trip.</p>
    </LegalPage>
  );
}
