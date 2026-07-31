import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Refund Policy",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedAt="31 July 2026">
      <p>
        We aim to make refunds simple and fair. This policy explains how refunds are handled for
        bookings made with Travel Info Centre (TIC).
      </p>
      <h2>Eligibility</h2>
      <p>
        Refunds are processed for cancellations made in accordance with our{" "}
        <a href="/cancellation-policy">Cancellation Policy</a>, for services not rendered, or for
        payment errors.
      </p>
      <h2>Processing Time</h2>
      <p>
        Approved refunds are processed to the original payment method within 7–10 business days.
      </p>
      <h2>Non-Refundable Items</h2>
      <p>
        Government entry fees, third-party hotel charges already paid on your behalf, and
        no-show bookings are generally non-refundable.
      </p>
      <h2>How to Request a Refund</h2>
      <p>
        Contact our support team at <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or
        call {COMPANY.primaryPhone} with your booking number.
      </p>
    </LegalPage>
  );
}
