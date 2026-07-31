"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { JOURNEY_TYPES, type JourneyType } from "@/lib/constants";
import { bookingCreateSchema, type BookingCreateInput } from "@/lib/validation/booking";

type BookingFormInput = z.input<typeof bookingCreateSchema>;
import {
  previewFareAction,
  submitBookingAction,
  type ActionResult,
} from "@/server/actions/bookingActions";

type VehicleOption = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  pricePerKm: number;
  category: { name: string };
  images: { url: string; alt: string }[];
};

type PackageOption = {
  id: string;
  slug: string;
  title: string;
  price: number;
  discountPrice: number | null;
  images: { url: string; alt: string }[];
};

const JOURNEY_LABELS: Record<JourneyType, string> = {
  one_way: "One Way",
  round_trip: "Round Trip",
  local: "Local / City",
  outstation: "Outstation",
  package: "Tour Package",
};

const STEPS = ["Trip & Vehicle", "Your Details", "Review & Confirm"] as const;

export function BookingWizard({
  vehicles,
  packages,
  preselectedVehicleId,
  preselectedPackageId,
}: {
  vehicles: VehicleOption[];
  packages: PackageOption[];
  preselectedVehicleId?: string;
  preselectedPackageId?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [fare, setFare] = useState<Awaited<ReturnType<typeof previewFareAction>> | null>(null);
  const [fareLoading, startFareTransition] = useTransition();
  const [submitting, startSubmitTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<BookingFormInput, unknown, BookingCreateInput>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      journeyType: preselectedPackageId ? "package" : "outstation",
      vehicleId: preselectedVehicleId,
      packageId: preselectedPackageId,
      pickupLocation: "",
      dropLocation: "",
      pickupTime: "09:00",
      passengers: 1,
      estimatedKm: 0,
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      specialRequest: "",
      promoCode: "",
    },
  });

  const watched = watch();
  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === watched.vehicleId),
    [vehicles, watched.vehicleId],
  );
  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === watched.packageId),
    [packages, watched.packageId],
  );

  useEffect(() => {
    if (!watched.vehicleId && !watched.packageId) return;
    if (!watched.pickupDate) return;

    const handle = setTimeout(() => {
      startFareTransition(async () => {
        const result = await previewFareAction({
          vehicleId: watched.vehicleId,
          packageId: watched.packageId,
          pickupDate: watched.pickupDate,
          pickupTime: watched.pickupTime,
          estimatedKm: watched.estimatedKm,
          promoCode: watched.promoCode,
        });
        setFare(result);
      });
    }, 400);
    return () => clearTimeout(handle);
  }, [
    watched.vehicleId,
    watched.packageId,
    watched.pickupDate,
    watched.pickupTime,
    watched.estimatedKm,
    watched.promoCode,
  ]);

  async function goNext() {
    const fieldsByStep: (keyof BookingFormInput)[][] = [
      ["journeyType", "vehicleId", "packageId", "pickupLocation", "pickupDate", "pickupTime", "returnDate", "passengers", "estimatedKm"],
      ["customerName", "customerPhone", "customerEmail"],
      [],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function onSubmit(data: BookingCreateInput) {
    setSubmitError(null);
    startSubmitTransition(async () => {
      const result: ActionResult<{ bookingNumber: string; totalAmount: number }> =
        await submitBookingAction(data);
      if (result.ok) {
        router.push(`/book/confirmation/${result.data.bookingNumber}`);
      } else {
        setSubmitError(result.error);
      }
    });
  }

  const isPackageJourney = watched.journeyType === "package" || !!watched.packageId;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ol className="mb-8 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  i < step
                    ? "bg-brand-royal text-white"
                    : i === step
                      ? "bg-brand-gold text-brand-slate"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="size-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  i === step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-border" />}
            </li>
          ))}
        </ol>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 0 && (
            <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
              <div>
                <Label>Journey Type</Label>
                <Controller
                  control={control}
                  name="journeyType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="mt-1.5 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOURNEY_TYPES.map((jt) => (
                          <SelectItem key={jt} value={jt}>
                            {JOURNEY_LABELS[jt]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {!isPackageJourney && (
                <div>
                  <Label>Select Vehicle</Label>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {vehicles.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setValue("vehicleId", v.id, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                          watched.vehicleId === v.id
                            ? "border-brand-royal ring-2 ring-brand-royal/30"
                            : "border-border hover:border-brand-royal/50",
                        )}
                      >
                        {v.images[0] && (
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image src={v.images[0].url} alt={v.images[0].alt} fill className="object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{v.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{v.basePrice.toLocaleString("en-IN")} + ₹{v.pricePerKm}/km
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.vehicleId && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.vehicleId.message}</p>
                  )}
                </div>
              )}

              {isPackageJourney && (
                <div>
                  <Label>Select Package</Label>
                  <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {packages.map((p) => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setValue("packageId", p.id, { shouldValidate: true })}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                          watched.packageId === p.id
                            ? "border-brand-royal ring-2 ring-brand-royal/30"
                            : "border-border hover:border-brand-royal/50",
                        )}
                      >
                        {p.images[0] && (
                          <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image src={p.images[0].url} alt={p.images[0].alt} fill className="object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{Number(p.discountPrice ?? p.price).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <Input id="pickupLocation" className="mt-1.5" {...register("pickupLocation")} />
                  {errors.pickupLocation && (
                    <p className="mt-1.5 text-sm text-destructive">
                      {errors.pickupLocation.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="dropLocation">Drop Location (optional)</Label>
                  <Input id="dropLocation" className="mt-1.5" {...register("dropLocation")} />
                </div>
                <div>
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input id="pickupDate" type="date" className="mt-1.5" {...register("pickupDate")} />
                  {errors.pickupDate && (
                    <p className="mt-1.5 text-sm text-destructive">{errors.pickupDate.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="pickupTime">Pickup Time</Label>
                  <Input id="pickupTime" type="time" className="mt-1.5" {...register("pickupTime")} />
                </div>
                {watched.journeyType === "round_trip" && (
                  <div>
                    <Label htmlFor="returnDate">Return Date</Label>
                    <Input id="returnDate" type="date" className="mt-1.5" {...register("returnDate")} />
                    {errors.returnDate && (
                      <p className="mt-1.5 text-sm text-destructive">{errors.returnDate.message}</p>
                    )}
                  </div>
                )}
                <div>
                  <Label htmlFor="passengers">Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    min={1}
                    className="mt-1.5"
                    {...register("passengers", { valueAsNumber: true })}
                  />
                </div>
                {!isPackageJourney && (
                  <div>
                    <Label htmlFor="estimatedKm">Estimated Distance (km)</Label>
                    <Input
                      id="estimatedKm"
                      type="number"
                      min={0}
                      className="mt-1.5"
                      {...register("estimatedKm", { valueAsNumber: true })}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div>
                <Label htmlFor="customerName">Full Name</Label>
                <Input id="customerName" className="mt-1.5" {...register("customerName")} />
                {errors.customerName && (
                  <p className="mt-1.5 text-sm text-destructive">{errors.customerName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerPhone">Mobile Number</Label>
                <Input id="customerPhone" className="mt-1.5" {...register("customerPhone")} />
                {errors.customerPhone && (
                  <p className="mt-1.5 text-sm text-destructive">{errors.customerPhone.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="customerEmail">Email (optional)</Label>
                <Input id="customerEmail" type="email" className="mt-1.5" {...register("customerEmail")} />
              </div>
              <div>
                <Label htmlFor="promoCode">Promo Code (optional)</Label>
                <Input id="promoCode" className="mt-1.5" {...register("promoCode")} />
              </div>
              <div>
                <Label htmlFor="specialRequest">Special Request (optional)</Label>
                <Textarea id="specialRequest" className="mt-1.5" rows={3} {...register("specialRequest")} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-heading text-lg font-semibold">Review Your Booking</h3>
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Journey Type</dt>
                  <dd className="font-medium">{JOURNEY_LABELS[watched.journeyType]}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Vehicle / Package</dt>
                  <dd className="font-medium">
                    {selectedVehicle?.name ?? selectedPackage?.title ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Pickup</dt>
                  <dd className="font-medium">
                    {watched.pickupLocation} on {watched.pickupDate as unknown as string} at{" "}
                    {watched.pickupTime}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Passengers</dt>
                  <dd className="font-medium">{String(watched.passengers)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="font-medium">
                    {watched.customerName} · {watched.customerPhone}
                  </dd>
                </div>
              </dl>
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
            >
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext} className="bg-brand-gradient text-white">
                Continue
              </Button>
            ) : (
              <Button type="submit" disabled={submitting} className="bg-brand-gradient text-white">
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Confirm Booking
              </Button>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="font-heading text-lg font-semibold">Fare Summary</h3>
          {fareLoading && <p className="mt-3 text-sm text-muted-foreground">Calculating…</p>}
          {!fareLoading && fare?.ok && (
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Base fare" value={fare.data.baseFare} />
              {fare.data.distanceFare > 0 && <Row label="Distance charge" value={fare.data.distanceFare} />}
              {fare.data.nightCharge > 0 && <Row label="Night charge" value={fare.data.nightCharge} />}
              {fare.data.discountAmount > 0 && (
                <Row label="Discount" value={-fare.data.discountAmount} />
              )}
              <Row label="GST (5%)" value={fare.data.taxAmount} />
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-heading text-base font-bold">
                <span>Total</span>
                <span className="text-brand-royal">
                  ₹{fare.data.totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
            </dl>
          )}
          {!fareLoading && !fare && (
            <p className="mt-3 text-sm text-muted-foreground">
              Select a vehicle or package and pickup date to see your fare.
            </p>
          )}
          {!fareLoading && fare && !fare.ok && (
            <p className="mt-3 text-sm text-destructive">{fare.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>
        {value < 0 ? "-" : ""}₹{Math.abs(value).toLocaleString("en-IN")}
      </dd>
    </div>
  );
}
