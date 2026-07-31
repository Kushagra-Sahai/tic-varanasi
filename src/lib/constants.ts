// Single source of truth for the string "enum" fields in prisma/schema.prisma.
// Schema uses plain String columns (SQLite dev / MySQL prod portability) —
// these tuples + the Zod schemas in lib/validation/ are what actually enforce
// the allowed values at the application boundary.

export const ROLES = ["admin", "manager", "driver", "customer"] as const;
export type Role = (typeof ROLES)[number];

export const JOURNEY_TYPES = [
  "one_way",
  "round_trip",
  "local",
  "outstation",
  "package",
] as const;
export type JourneyType = (typeof JOURNEY_TYPES)[number];

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "assigned",
  "completed",
  "cancelled",
  "refunded",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  assigned: "Driver Assigned",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

// Allowed forward transitions in the booking lifecycle.
export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["assigned", "cancelled"],
  assigned: ["completed", "cancelled"],
  completed: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

export const PAYMENT_METHODS = [
  "razorpay",
  "phonepe",
  "cashfree",
  "payu",
  "upi",
  "card",
  "netbanking",
  "wallet",
  "cash",
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ["pending", "success", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const AC_TYPES = ["AC", "Non-AC"] as const;
export type AcType = (typeof AC_TYPES)[number];

export const GST_RATE = 0.05; // 5% GST on passenger transport services

export const COMPANY = {
  name: "Travel Info Centre (TIC)",
  tagline: "Your Trusted Travel Partner – 25+ Years of Trusted Service",
  address: "Varanasi, Uttar Pradesh, India",
  phones: ["0542-4543026", "9795903030", "8081947598"],
  primaryPhone: "9795903030",
  email: "ticvns@gmail.com",
} as const;
