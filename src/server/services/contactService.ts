import "server-only";
import { mutateCollection, newId, readCollection } from "@/lib/jsondb";
import type { ContactEnquiry } from "@/lib/entities";
import type { ContactEnquiryInput } from "@/lib/validation/contact";

export async function createContactEnquiry(input: ContactEnquiryInput) {
  const enquiry: ContactEnquiry = {
    id: newId(),
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    message: input.message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  await mutateCollection<ContactEnquiry>("contactEnquiries", (rows) => [...rows, enquiry]);
  return enquiry;
}

export async function listContactEnquiries() {
  const rows = await readCollection<ContactEnquiry>("contactEnquiries");
  return [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
