"use server";

import { revalidatePath } from "next/cache";
import { mutateCollection, mutateRecord, newId } from "@/lib/jsondb";
import { requireRole, STAFF_ROLES } from "@/lib/rbac";
import { vehicleUpsertSchema } from "@/lib/validation/vehicle";
import { packageUpsertSchema } from "@/lib/validation/package";
import { bookingStatusUpdateSchema } from "@/lib/validation/booking";
import * as bookingService from "@/server/services/bookingService";
import type { ActionResult } from "@/server/actions/bookingActions";
import type { ContactEnquiry, Package, Settings, Vehicle } from "@/lib/entities";

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
  const featureLabels = splitLines(raw.featuresText);
  const { id, ...data } = parsed.data;

  try {
    let saved!: Vehicle;
    await mutateCollection<Vehicle>("vehicles", (rows) => {
      const now = new Date().toISOString();
      const images = imageUrls.map((url, i) => ({
        id: newId(),
        url,
        alt: data.name,
        sortOrder: i,
        isPrimary: i === 0,
      }));
      const features = featureLabels.map((label) => ({ id: newId(), label, icon: null }));

      if (id) {
        const idx = rows.findIndex((v) => v.id === id);
        if (idx === -1) throw new Error("Vehicle not found");
        const existing = rows[idx];
        const next: Vehicle = {
          ...existing,
          ...data,
          updatedAt: now,
          images: imageUrls.length > 0 ? images : existing.images,
          features: featureLabels.length > 0 ? features : existing.features,
        };
        saved = next;
        const copy = [...rows];
        copy[idx] = next;
        return copy;
      }

      const created: Vehicle = {
        id: newId(),
        ...data,
        createdAt: now,
        updatedAt: now,
        images,
        features,
        pricingRules: [],
      };
      saved = created;
      return [...rows, created];
    });

    revalidatePath("/admin/vehicles");
    revalidatePath("/car-rental");
    revalidatePath(`/vehicles/${saved.slug}`);
    return { ok: true, data: { id: saved.id } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save vehicle" };
  }
}

export async function deleteVehicleAction(id: string): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  try {
    await mutateCollection<Vehicle>("vehicles", (rows) => rows.filter((v) => v.id !== id));
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
    let saved!: Package;
    await mutateCollection<Package>("packages", (rows) => {
      const now = new Date().toISOString();
      const images = imageUrls.map((url, i) => ({
        id: newId(),
        url,
        alt: data.title,
        sortOrder: i,
        isPrimary: i === 0,
      }));

      if (id) {
        const idx = rows.findIndex((p) => p.id === id);
        if (idx === -1) throw new Error("Package not found");
        const existing = rows[idx];
        const next: Package = {
          ...existing,
          ...data,
          discountPrice: data.discountPrice ?? null,
          updatedAt: now,
          images: imageUrls.length > 0 ? images : existing.images,
        };
        saved = next;
        const copy = [...rows];
        copy[idx] = next;
        return copy;
      }

      const created: Package = {
        id: newId(),
        ...data,
        discountPrice: data.discountPrice ?? null,
        createdAt: now,
        updatedAt: now,
        images,
        itinerary: [],
        inclusions: [],
        exclusions: [],
      };
      saved = created;
      return [...rows, created];
    });

    revalidatePath("/admin/packages");
    revalidatePath("/tour-packages");
    revalidatePath(`/tour-packages/${saved.slug}`);
    return { ok: true, data: { id: saved.id } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not save package" };
  }
}

export async function deletePackageAction(id: string): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  try {
    await mutateCollection<Package>("packages", (rows) => rows.filter((p) => p.id !== id));
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
  await mutateCollection<ContactEnquiry>("contactEnquiries", (rows) =>
    rows.map((e) => (e.id === id ? { ...e, isRead } : e)),
  );
  revalidatePath("/admin/enquiries");
  return { ok: true, data: null };
}

export async function updateSettingsAction(
  values: Record<string, string>,
): Promise<ActionResult<null>> {
  await requireRole(...STAFF_ROLES);
  await mutateRecord<Settings>("settings", (current) => ({ ...(current ?? {}), ...values }));
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
  return { ok: true, data: null };
}
