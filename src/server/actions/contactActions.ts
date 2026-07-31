"use server";

import { contactEnquirySchema } from "@/lib/validation/contact";
import { createContactEnquiry } from "@/server/services/contactService";
import type { ActionResult } from "@/server/actions/bookingActions";

export async function submitContactAction(input: unknown): Promise<ActionResult<null>> {
  const parsed = contactEnquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await createContactEnquiry(parsed.data);
    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "Could not submit your message. Please try again." };
  }
}
