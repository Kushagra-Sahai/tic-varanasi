import { z } from "zod";
import { BOOKING_STATUSES, JOURNEY_TYPES } from "@/lib/constants";

export const bookingCreateSchema = z
  .object({
    journeyType: z.enum(JOURNEY_TYPES),
    vehicleId: z.string().min(1).optional(),
    packageId: z.string().min(1).optional(),
    pickupLocation: z.string().min(3, "Pickup location is required"),
    dropLocation: z.string().min(3).optional().or(z.literal("")),
    pickupDate: z.coerce.date({ message: "Pickup date is required" }),
    pickupTime: z.string().min(1, "Pickup time is required"),
    returnDate: z.coerce.date().optional(),
    passengers: z.coerce.number().int().min(1).max(60),
    estimatedKm: z.coerce.number().min(0).max(5000).default(0),
    customerName: z.string().min(2, "Name is required"),
    customerPhone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
    customerEmail: z.string().email().optional().or(z.literal("")),
    specialRequest: z.string().max(500).optional().or(z.literal("")),
    promoCode: z.string().max(30).optional().or(z.literal("")),
  })
  .refine((data) => data.vehicleId || data.packageId, {
    message: "Select a vehicle or a package",
    path: ["vehicleId"],
  })
  .refine(
    (data) => data.journeyType !== "round_trip" || !!data.returnDate,
    { message: "Return date is required for round trips", path: ["returnDate"] },
  );

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;

export const bookingStatusUpdateSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(BOOKING_STATUSES),
  note: z.string().max(500).optional(),
  driverId: z.string().min(1).optional(),
});

export type BookingStatusUpdateInput = z.infer<typeof bookingStatusUpdateSchema>;
