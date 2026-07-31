import { z } from "zod";
import { AC_TYPES } from "@/lib/constants";

export const vehicleUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  name: z.string().min(2),
  categoryId: z.string().min(1, "Category is required"),
  capacity: z.coerce.number().int().min(1).max(60),
  luggageCapacity: z.coerce.number().int().min(0).max(50),
  acType: z.enum(AC_TYPES),
  transmission: z.string().min(2),
  basePrice: z.coerce.number().min(0),
  pricePerKm: z.coerce.number().min(0),
  driverAllowance: z.coerce.number().min(0).default(0),
  nightCharge: z.coerce.number().min(0).default(0),
  fuelType: z.string().min(2),
  description: z.string().min(10),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type VehicleUpsertInput = z.infer<typeof vehicleUpsertSchema>;

export const vehicleCategoryUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

export type VehicleCategoryUpsertInput = z.infer<typeof vehicleCategoryUpsertSchema>;
