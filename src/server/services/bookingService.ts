import "server-only";
import { format } from "date-fns";
import { db } from "@/lib/db";
import { calculateFare, resolveSeasonalMultiplier } from "@/lib/pricing";
import { BOOKING_STATUS_TRANSITIONS, type BookingStatus } from "@/lib/constants";
import type { BookingCreateInput } from "@/lib/validation/booking";
import type { Prisma } from "@prisma/client";

export class BookingError extends Error {}

async function generateBookingNumber(tx: Prisma.TransactionClient): Promise<string> {
  const now = new Date();
  const datePart = format(now, "yyMMdd");
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const count = await tx.booking.count({
    where: { createdAt: { gte: startOfDay, lt: endOfDay } },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `TIC-${datePart}-${seq}`;
}

async function resolveCustomerId(
  tx: Prisma.TransactionClient,
  input: { phone: string; name: string; email?: string },
) {
  const user = await tx.user.upsert({
    where: { phone: input.phone },
    update: {},
    create: {
      phone: input.phone,
      name: input.name,
      email: input.email || undefined,
      role: "customer",
    },
  });

  const customer = await tx.customer.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  return customer.id;
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
    const pkg = await db.package.findUnique({ where: { id: input.packageId } });
    if (!pkg) throw new BookingError("Package not found");
    const price = Number(pkg.discountPrice ?? pkg.price);
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

  const vehicle = await db.vehicle.findUnique({
    where: { id: input.vehicleId },
    include: { pricingRules: true },
  });
  if (!vehicle) throw new BookingError("Vehicle not found");

  const [hour] = input.pickupTime.split(":").map(Number);
  const isNightCharge = hour >= 22 || hour < 6;
  const seasonalMultiplier = resolveSeasonalMultiplier(
    vehicle.pricingRules.map((r) => ({
      startDate: r.startDate,
      endDate: r.endDate,
      multiplier: Number(r.multiplier),
    })),
    input.pickupDate,
  );

  const subtotalEstimate =
    Number(vehicle.basePrice) + Number(vehicle.pricePerKm) * input.estimatedKm;

  return calculateFare({
    basePrice: Number(vehicle.basePrice),
    pricePerKm: Number(vehicle.pricePerKm),
    driverAllowance: Number(vehicle.driverAllowance),
    nightCharge: Number(vehicle.nightCharge),
    chargeableKm: input.estimatedKm,
    isNightCharge,
    seasonalMultiplier,
    coupon: await resolveCoupon(input.promoCode, subtotalEstimate),
  });
}

async function resolveCoupon(code: string | undefined, amount: number) {
  if (!code) return null;
  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon || !coupon.isActive) return null;
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTo) return null;
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;
  if (amount < Number(coupon.minAmount)) return null;
  return {
    discountType: coupon.discountType as "percentage" | "flat",
    discountValue: Number(coupon.discountValue),
    minAmount: Number(coupon.minAmount),
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

  return db.$transaction(async (tx) => {
    const customerId = await resolveCustomerId(tx, {
      phone: input.customerPhone,
      name: input.customerName,
      email: input.customerEmail,
    });

    const bookingNumber = await generateBookingNumber(tx);

    const booking = await tx.booking.create({
      data: {
        bookingNumber,
        customerId,
        vehicleId: input.vehicleId,
        packageId: input.packageId,
        journeyType: input.journeyType,
        pickupLocation: input.pickupLocation,
        dropLocation: input.dropLocation || null,
        pickupDate: input.pickupDate,
        pickupTime: input.pickupTime,
        returnDate: input.returnDate,
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
        statusHistory: { create: { status: "pending", note: "Booking created" } },
        payments: { create: { amount: fare.totalAmount, method: "cash", status: "pending" } },
      },
      include: { statusHistory: true, payments: true },
    });

    if (input.promoCode) {
      await tx.coupon
        .update({ where: { code: input.promoCode }, data: { usedCount: { increment: 1 } } })
        .catch(() => undefined);
    }

    return { booking, fare };
  });
}

export async function getBookingByNumber(bookingNumber: string) {
  return db.booking.findUnique({
    where: { bookingNumber },
    include: {
      vehicle: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
      package: { include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } },
      statusHistory: { orderBy: { changedAt: "asc" } },
      payments: true,
    },
  });
}

export async function listBookings(options?: { status?: BookingStatus; customerId?: string }) {
  return db.booking.findMany({
    where: { status: options?.status, customerId: options?.customerId },
    include: { vehicle: true, package: true, customer: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateBookingStatus(
  bookingId: string,
  nextStatus: BookingStatus,
  options?: { note?: string; driverId?: string },
) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new BookingError("Booking not found");

  const currentStatus = booking.status as BookingStatus;
  const allowed = BOOKING_STATUS_TRANSITIONS[currentStatus];
  if (!allowed.includes(nextStatus)) {
    throw new BookingError(`Cannot move booking from ${currentStatus} to ${nextStatus}`);
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: {
        status: nextStatus,
        driverId: nextStatus === "assigned" ? options?.driverId : undefined,
      },
    });
    await tx.bookingStatusHistory.create({
      data: { bookingId, status: nextStatus, note: options?.note },
    });
    return updated;
  });
}
