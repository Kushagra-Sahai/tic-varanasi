// Plain TS shapes for the JSON-file store (data/*.json). Child records that
// used to be separate relational tables (images, itinerary, status history…)
// are embedded arrays on their parent — there's no relational engine to join
// against anymore, so there's no reason to keep them normalized.

export type VehicleCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
};

export type VehicleImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type VehicleFeature = {
  id: string;
  label: string;
  icon: string | null;
};

export type PricingRule = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  multiplier: number;
};

export type Vehicle = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  capacity: number;
  luggageCapacity: number;
  acType: string;
  transmission: string;
  basePrice: number;
  pricePerKm: number;
  driverAllowance: number;
  nightCharge: number;
  fuelType: string;
  description: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  images: VehicleImage[];
  features: VehicleFeature[];
  pricingRules: PricingRule[];
};

export type PackageImage = {
  id: string;
  url: string;
  alt: string;
  sortOrder: number;
  isPrimary: boolean;
};

export type ItineraryDay = {
  id: string;
  dayNumber: number;
  title: string;
  details: string;
};

export type Inclusion = { id: string; label: string };
export type Exclusion = { id: string; label: string };

export type Package = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  durationDays: number;
  durationNights: number;
  price: number;
  discountPrice: number | null;
  maxGroupSize: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  images: PackageImage[];
  itinerary: ItineraryDay[];
  inclusions: Inclusion[];
  exclusions: Exclusion[];
};

export type Destination = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  history: string;
  bestSeason: string | null;
  weatherInfo: string | null;
  mapEmbedUrl: string | null;
  isActive: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string | null;
  message: string;
  photoUrl: string | null;
  rating: number;
  isFeatured: boolean;
  sortOrder: number;
};

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
};

export type ContactEnquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type Driver = {
  id: string;
  userId: string;
  name: string;
  licenseNo: string;
  experience: number;
  rating: number;
  isAvailable: boolean;
};

export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: "percentage" | "flat";
  discountValue: number;
  minAmount: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
};

export type BookingStatusHistoryEntry = {
  id: string;
  status: string;
  note: string | null;
  changedAt: string;
};

export type Payment = {
  id: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
};

export type Booking = {
  id: string;
  bookingNumber: string;
  vehicleId: string | null;
  packageId: string | null;
  driverId: string | null;
  journeyType: string;
  pickupLocation: string;
  dropLocation: string | null;
  pickupDate: string;
  pickupTime: string;
  returnDate: string | null;
  passengers: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  specialRequest: string | null;
  promoCode: string | null;
  baseFare: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: BookingStatusHistoryEntry[];
  payments: Payment[];
};

export type User = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  passwordHash: string | null;
  role: "admin" | "manager" | "driver" | "customer";
  isActive: boolean;
  createdAt: string;
};

export type OtpToken = {
  id: string;
  phone: string;
  code: string;
  expiresAt: string;
  consumed: boolean;
  createdAt: string;
};

export type Settings = Record<string, string>;
