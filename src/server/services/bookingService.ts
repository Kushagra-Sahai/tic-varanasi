import "server-only";
import { format } from "date-fns";
import { mutateCollection, newId, readCollection } from "@/lib/jsondb";
import { calculateFare, resolveSeasonalMultiplier } from "@/lib/pricing";
import { BOOKING_STATUS_TRANSITIONS, type BookingStatus } from "@/lib/constants";
import type { BookingCreateInput } from "@/lib/validation/booking";
import type { Booking, Coupon, Package, Vehicle } from "@/lib/entities";

export class BookingError extends Error {}

function generateBookingNumber(rows: Booking[]): string {
  const now = new Date();
  const datePart = format(now, "yyMMdd");
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const count = rows.filter((b) => {
    const created = new Date(b.createdAt);
    return created >= startOfDay && created < endOfDay;
  }).length;
  const seq = String(count + 1).padStart(4, "0");
  return `TIC-${datePart}-${seq}`;
}

export async function previewFare(input: {
  vehicleId?: string;
  packageId?: string;
  pickupDate: Date;
  pickupTime: string;
  estimatedKm: number;
  promoCode?: string;
}) {
  if (input.packageId) {
    const packages = await readCollection<Package>("packages");
    const pkg = packages.find((p) => p.id === input.packageId);
    if (!pkg) throw new BookingError("Package not found");
    const price = pkg.discountPrice ?? pkg.price;
    return calculateFare({
      basePrice: price,
      pricePerKm: 0,
      driverAllowance: 0,
      nightCharge: 0,
      chargeableKm: 0,
      coupon: await resolveCoupon(input.promoCode, price),
    });
  }

  if (!input.vehicleId) throw new BookingError("Select a vehicle or package");

  const vehicles = await readCollection<Vehicle>("vehicles");
  const vehicle = vehicles.find((v) => v.id === input.vehicleId);
  if (!vehicle) throw new BookingError("Vehicle not found");

  const [hour] = input.pickupTime.split(":").map(Number);
  const isNightCharge = hour >= 22 || hour < 6;
  const seasonalMultiplier = resolveSeasonalMultiplier(
    vehicle.pricingRules.map((r) => ({
      startDate: new Date(r.startDate),
      endDate: new Date(r.endDate),
      multiplier: r.multiplier,
    })),
    input.pickupDate,
  );

  const subtotalEstimate = vehicle.basePrice + vehicle.pricePerKm * input.estimatedKm;

  return calculateFare({
    basePrice: vehicle.basePrice,
    pricePerKm: vehicle.pricePerKm,
    driverAllowance: vehicle.driverAllowance,
    nightCharge: vehicle.nightCharge,
    chargeableKm: input.estimatedKm,
    isNightCharge,
    seasonalMultiplier,
    coupon: await resolveCoupon(input.promoCode, subtotalEstimate),
  });
}

async function resolveCoupon(code: string | undefined, amount: number) {
  if (!code) return null;
  const coupons = await readCollection<Coupon>("coupons");
  const coupon = coupons.find((c) => c.code === code);
  if (!coupon || !coupon.isActive) return null;
  const now = new Date();
  if (now < new Date(coupon.validFrom) || now > new Date(coupon.validTo)) return null;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
  if (amount < coupon.minAmount) return null;
  return {
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    minAmount: coupon.minAmount,
  };
}

export async function createBooking(input: BookingCreateInput) {
  const fare = await previewFare({
    vehicleId: input.vehicleId,
    packageId: input.packageId,
    pickupDate: input.pickupDate,
    pickupTime: input.pickupTime,
    estimatedKm: input.estimatedKm,
    promoCode: input.promoCode,
  });

  let createdBooking!: Booking;

  await mutateCollection<Booking>("bookings", (rows) => {
    const now = new Date().toISOString();
    const booking: Booking = {
      id: newId(),
      bookingNumber: generateBookingNumber(rows),
      vehicleId: input.vehicleId ?? null,
      packageId: input.packageId ?? null,
      driverId: null,
      journeyType: input.journeyType,
      pickupLocation: input.pickupLocation,
      dropLocation: input.dropLocation || null,
      pickupDate: input.pickupDate.toISOString(),
      pickupTime: input.pickupTime,
      returnDate: input.returnDate ? input.returnDate.toISOString() : null,
      passengers: input.passengers,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerEmail: input.customerEmail || null,
      specialRequest: input.specialRequest || null,
      promoCode: input.promoCode || null,
      baseFare: fare.subtotal,
      discountAmount: fare.discountAmount,
      taxAmount: fare.taxAmount,
      totalAmount: fare.totalAmount,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      statusHistory: [{ id: newId(), status: "pending", note: "Booking created", changedAt: now }],
      payments: [
        { id: newId(), amount: fare.totalAmount, method: "cash", status: "pending", transactionId: null, createdAt: now },
      ],
    };
    createdBooking = booking;
    return [...rows, booking];
  });

  if (input.promoCode) {
    await mutateCollection<Coupon>("coupons", (rows) =>
      rows.map((c) => (c.code === input.promoCode ? { ...c, usedCount: c.usedCount + 1 } : c)),
    );
  }

  return { booking: createdBooking, fare };
}

async function joinVehicleAndPackage(booking: Booking) {
  const [vehicles, packages] = await Promise.all([
    readCollection<Vehicle>("vehicles"),
    readCollection<Package>("packages"),
  ]);
  return {
    vehicle: booking.vehicleId ? (vehicles.find((v) => v.id === booking.vehicleId) ?? null) : null,
    package: booking.packageId ? (packages.find((p) => p.id === booking.packageId) ?? null) : null,
  };
}

export async function getBookingByNumber(bookingNumber: string) {
  const bookings = await readCollection<Booking>("bookings");
  const booking = bookings.find((b) => b.bookingNumber === bookingNumber);
  if (!booking) return null;

  const joined = await joinVehicleAndPackage(booking);
  return {
    ...booking,
    ...joined,
    statusHistory: [...booking.statusHistory].sort((a, b) => a.changedAt.localeCompare(b.changedAt)),
  };
}

export async function listBookings(options?: { status?: BookingStatus }) {
  const bookings = await readCollection<Booking>("bookings");
  const [vehicles, packages] = await Promise.all([
    readCollection<Vehicle>("vehicles"),
    readCollection<Package>("packages"),
  ]);
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]));
  const packageById = new Map(packages.map((p) => [p.id, p]));

  const filtered = options?.status ? bookings.filter((b) => b.status === options.status) : bookings;
  const sorted = [...filtered].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return sorted.map((b) => ({
    ...b,
    vehicle: b.vehicleId ? (vehicleById.get(b.vehicleId) ?? null) : null,
    package: b.packageId ? (packageById.get(b.packageId) ?? null) : null,
  }));
}

export async function updateBookingStatus(
  bookingId: string,
  nextStatus: BookingStatus,
  options?: { note?: string; driverId?: string },
) {
  let updated!: Booking;

  await mutateCollection<Booking>("bookings", (rows) => {
    const idx = rows.findIndex((b) => b.id === bookingId);
    if (idx === -1) throw new BookingError("Booking not found");

    const booking = rows[idx];
    const currentStatus = booking.status as BookingStatus;
    const allowed = BOOKING_STATUS_TRANSITIONS[currentStatus];
    if (!allowed.includes(nextStatus)) {
      throw new BookingError(`Cannot move booking from ${currentStatus} to ${nextStatus}`);
    }

    const now = new Date().toISOString();
    const next: Booking = {
      ...booking,
      status: nextStatus,
      driverId: nextStatus === "assigned" ? (options?.driverId ?? booking.driverId) : booking.driverId,
      updatedAt: now,
      statusHistory: [
        ...booking.statusHistory,
        { id: newId(), status: nextStatus, note: options?.note ?? null, changedAt: now },
      ],
    };
    updated = next;

    const copy = [...rows];
    copy[idx] = next;
    return copy;
  });

  return updated;
}
