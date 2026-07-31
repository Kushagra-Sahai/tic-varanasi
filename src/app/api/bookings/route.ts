import { NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/validation/booking";
import * as bookingService from "@/server/services/bookingService";
import { requireRole, STAFF_ROLES } from "@/lib/rbac";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/constants";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { booking, fare } = await bookingService.createBooking(parsed.data);
    return NextResponse.json(
      { bookingNumber: booking.bookingNumber, status: booking.status, fare },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create booking" },
      { status: 422 },
    );
  }
}

export async function GET(request: Request) {
  try {
    await requireRole(...STAFF_ROLES);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get("status");
  const status = BOOKING_STATUSES.includes(statusParam as BookingStatus)
    ? (statusParam as BookingStatus)
    : undefined;
  const bookings = await bookingService.listBookings({ status });
  return NextResponse.json({ bookings });
}
