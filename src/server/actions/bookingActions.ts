"use server";

import { bookingCreateSchema } from "@/lib/validation/booking";
import * as bookingService from "@/server/services/bookingService";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function previewFareAction(input: unknown): Promise<
  ActionResult<Awaited<ReturnType<typeof bookingService.previewFare>>>
> {
  const parsed = bookingCreateSchema.partial().safeParse(input);
  const data = parsed.success ? parsed.data : (input as Record<string, unknown>);

  const vehicleId = data.vehicleId as string | undefined;
  const packageId = data.packageId as string | undefined;
  if (!vehicleId && !packageId) {
    return { ok: false, error: "Select a vehicle or package first" };
  }

  try {
    const fare = await bookingService.previewFare({
      vehicleId,
      packageId,
      pickupDate: data.pickupDate ? new Date(data.pickupDate as string | Date) : new Date(),
      pickupTime: (data.pickupTime as string) ?? "10:00",
      estimatedKm: Number(data.estimatedKm ?? 0),
      promoCode: data.promoCode as string | undefined,
    });
    return { ok: true, data: fare };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not calculate fare" };
  }
}

export async function submitBookingAction(input: unknown): Promise<
  ActionResult<{ bookingNumber: string; totalAmount: number }>
> {
  const parsed = bookingCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const { booking, fare } = await bookingService.createBooking(parsed.data);
    return {
      ok: true,
      data: { bookingNumber: booking.bookingNumber, totalAmount: fare.totalAmount },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not create booking" };
  }
}
