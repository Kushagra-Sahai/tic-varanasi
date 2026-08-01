import "server-only";
import { readCollection } from "@/lib/jsondb";
import type { Faq } from "@/lib/entities";

export async function listFaqs() {
  const faqs = await readCollection<Faq>("faqs");
  return [...faqs].sort((a, b) => a.category.localeCompare(b.category) || a.sortOrder - b.sortOrder);
}
