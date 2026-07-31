import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="31 July 2026">
      <p>
        Travel Info Centre (TIC) (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects your
        privacy. This policy explains what information we collect when you use our website and
        services, and how we use it.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We collect information you provide directly, such as your name, phone number, email
        address and travel details when you make a booking or submit an enquiry.
      </p>
      <h2>How We Use Your Information</h2>
      <p>
        We use your information to process bookings, communicate trip details, provide customer
        support and improve our services. We do not sell your personal information to third
        parties.
      </p>
      <h2>Data Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect your data against
        unauthorised access, alteration or disclosure.
      </p>
      <h2>Contact Us</h2>
      <p>
        For any privacy-related questions, contact us at{" "}
        <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a> or call {COMPANY.primaryPhone}.
      </p>
    </LegalPage>
  );
}
