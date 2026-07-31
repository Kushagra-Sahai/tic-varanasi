import { z } from "zod";

export const contactEnquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().min(10, "Please share a few more details"),
});

export type ContactEnquiryInput = z.infer<typeof contactEnquirySchema>;
