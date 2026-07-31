import { z } from "zod";

export const packageUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  title: z.string().min(3),
  summary: z.string().min(10).max(300),
  description: z.string().min(20),
  durationDays: z.coerce.number().int().min(1).max(60),
  durationNights: z.coerce.number().int().min(0).max(59),
  price: z.coerce.number().min(0),
  discountPrice: z.coerce.number().min(0).optional(),
  maxGroupSize: z.coerce.number().int().min(1).default(20),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type PackageUpsertInput = z.infer<typeof packageUpsertSchema>;
