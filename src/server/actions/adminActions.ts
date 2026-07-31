"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole, STAFF_ROLES } from "@/lib/rbac";
import { vehicleUpsertSchema } from "@/lib/validation/vehicle";
import { packageUpsertSchema } from "@/lib/validation/package";
import { bookingStatusUpdateSchema } from "@/lib/validation/booking";
import * as bookingService from "@/server/services/bookingService";
import type { ActionResult } from "@/server/actions/bookingActions";

function splitLines(value: string | undefined) {
  return (value ?? "")
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function upsertVehicleAction(
  input: unknown & { imagesText?: string; featuresText?: string },
): Promise<ActionResult<{ id: string }>> {
  await requireRole(...STAFF_ROLES);

  const parsed = vehicleUpsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const raw = input as { imagesText?: string; featuresText?: string };
  const imageUrls = splitLines(raw.imagesText);
  const features = splitLines(raw.featuresText);
  const { id, ...data } = parsed.data;

  try {
    const vehicle = id
      ? await db.vehicle.update({ where: { id }, data })
      : await db.vehicle.create({ data });

    if (imageUrls.length > 0) {
      await db.vehicleImage.deleteMany({ where: { vehicleId: vehicle.id } });
      await db.vehicleImage.createMany({
        data: imageUrls.map((url, i) => ({
          vehicleId: vehicle.id,
          url,
          alt: vehicle.name,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      });
    }
    if (features.length > 0) {
      await db.vehicleFeature.deleteMany({ where: { vehicleId: vehicle.id } });
      await db.vehicleFeature.createMany({
        data: features.map((label) => ({ vehicleId: vehicle.id, label })),
      });
    }

    revalidatePath("/admin/vehicles");
    revalidatePath("/car-rental");
    revalidatePath(`/vehicles/${vehicle.slug}`);
    return { ok: true, data: { id: vehicle.id } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save vehicle" };
  }
}

export async function deleteVehicleAction(id: string): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  try {
    await db.vehicle.delete({ where: { id } });
    revalidatePath("/admin/vehicles");
    revalidatePath("/car-rental");
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete vehicle" };
  }
}

export async function upsertPackageAction(
  input: unknown & { imagesText?: string },
): Promise<ActionResult<{ id: string }>> {
  await requireRole(...STAFF_ROLES);

  const parsed = packageUpsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please correct the highlighted fields",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const raw = input as { imagesText?: string };
  const imageUrls = splitLines(raw.imagesText);
  const { id, ...data } = parsed.data;

  try {
    const pkg = id
      ? await db.package.update({ where: { id }, data })
      : await db.package.create({ data });

    if (imageUrls.length > 0) {
      await db.packageImage.deleteMany({ where: { packageId: pkg.id } });
      await db.packageImage.createMany({
        data: imageUrls.map((url, i) => ({
          packageId: pkg.id,
          url,
          alt: pkg.title,
          sortOrder: i,
          isPrimary: i === 0,
        })),
      });
    }

    revalidatePath("/admin/packages");
    revalidatePath("/tour-packages");
    revalidatePath(`/tour-packages/${pkg.slug}`);
    return { ok: true, data: { id: pkg.id } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save package" };
  }
}

export async function deletePackageAction(id: string): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  try {
    await db.package.delete({ where: { id } });
    revalidatePath("/admin/packages");
    revalidatePath("/tour-packages");
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not delete package" };
  }
}

export async function updateBookingStatusAction(input: unknown): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);

  const parsed = bookingStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid status update" };
  }

  try {
    await bookingService.updateBookingStatus(parsed.data.bookingId, parsed.data.status, {
      note: parsed.data.note,
      driverId: parsed.data.driverId,
    });
    revalidatePath("/admin/bookings");
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not update status" };
  }
}

export async function toggleEnquiryReadAction(
  id: string,
  isRead: boolean,
): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  await db.contactEnquiry.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin/enquiries");
  return { ok: true, data: null };
}

export async function updateSettingsAction(
  values: Record<string, string>,
): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  await Promise.all(
    Object.entries(values).map(([key, value]) =>
      db.setting.upsert({ where: { key }, update: { value }, create: { key, value } }),
    ),
  );
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, data: null };
}
