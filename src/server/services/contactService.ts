import "server-only";
import { db } from "@/lib/db";
import type { ContactEnquiryInput } from "@/lib/validation/contact";

export async function createContactEnquiry(input: ContactEnquiryInput) {
  return db.contactEnquiry.create({
    data: {
      name: input.name,
      phone: input.phone,
      email: input.email || null,
      message: input.message,
    },
  });
}

export async function listContactEnquiries() {
  return db.contactEnquiry.findMany({ orderBy: { createdAt: "desc" } });
}
