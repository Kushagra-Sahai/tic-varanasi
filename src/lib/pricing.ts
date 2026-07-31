import { GST_RATE } from "@/lib/constants";

export type VehicleFareInput = {
  basePrice: number;
  pricePerKm: number;
  driverAllowance: number;
  nightCharge: number;
};

export type FareBreakdownInput = VehicleFareInput & {
  chargeableKm: number;
  /** Pickup/return spans a night (22:00–06:00) window. */
  isNightCharge?: boolean;
  tolls?: number;
  parking?: number;
  /** Seasonal multiplier resolved from PricingRule for the travel dates (1.0 = no surge). */
  seasonalMultiplier?: number;
  coupon?: {
    discountType: "percentage" | "flat";
    discountValue: number;
    minAmount?: number;
  } | null;
};

export type FareBreakdown = {
  baseFare: number;
  distanceFare: number;
  driverAllowance: number;
  nightCharge: number;
  tolls: number;
  parking: number;
  subtotal: number;
  seasonalMultiplier: number;
  afterSeasonal: number;
  discountAmount: number;
  taxableAmount: number;
  taxAmount: number;
  totalAmount: number;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * The single fare calculation used by vehicle cards, the taxi-fare page, the
 * fare calculator, and the booking wizard's live total — so a price change
 * in the admin panel (basePrice, pricePerKm, a PricingRule) moves every
 * surface at once instead of drifting out of sync.
 */
export function calculateFare(input: FareBreakdownInput): FareBreakdown {
  const {
    basePrice,
    pricePerKm,
    driverAllowance,
    nightCharge,
    chargeableKm,
    isNightCharge = false,
    tolls = 0,
    parking = 0,
    seasonalMultiplier = 1,
    coupon = null,
  } = input;

  const distanceFare = pricePerKm * Math.max(0, chargeableKm);
  const appliedNightCharge = isNightCharge ? nightCharge : 0;

  const subtotal =
    basePrice + distanceFare + driverAllowance + appliedNightCharge + tolls + parking;

  const afterSeasonal = subtotal * seasonalMultiplier;

  let discountAmount = 0;
  if (coupon && afterSeasonal >= (coupon.minAmount ?? 0)) {
    discountAmount =
      coupon.discountType === "percentage"
        ? afterSeasonal * (coupon.discountValue / 100)
        : coupon.discountValue;
    discountAmount = Math.min(discountAmount, afterSeasonal);
  }

  const taxableAmount = afterSeasonal - discountAmount;
  const taxAmount = taxableAmount * GST_RATE;
  const totalAmount = taxableAmount + taxAmount;

  return {
    baseFare: round2(basePrice),
    distanceFare: round2(distanceFare),
    driverAllowance: round2(driverAllowance),
    nightCharge: round2(appliedNightCharge),
    tolls: round2(tolls),
    parking: round2(parking),
    subtotal: round2(subtotal),
    seasonalMultiplier,
    afterSeasonal: round2(afterSeasonal),
    discountAmount: round2(discountAmount),
    taxableAmount: round2(taxableAmount),
    taxAmount: round2(taxAmount),
    totalAmount: round2(totalAmount),
  };
}

/** Resolves the active seasonal multiplier for a vehicle on a given date, if any. */
export function resolveSeasonalMultiplier(
  rules: { startDate: Date; endDate: Date; multiplier: number }[],
  date: Date,
): number {
  const match = rules.find((r) => date >= r.startDate && date <= r.endDate);
  return match ? match.multiplier : 1;
}
