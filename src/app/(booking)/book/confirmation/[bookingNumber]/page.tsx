import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBookingByNumber } from "@/server/services/bookingService";
import { BOOKING_STATUS_LABELS, type BookingStatus, COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ bookingNumber: string }>;
}) {
  const { bookingNumber } = await params;
  const booking = await getBookingByNumber(bookingNumber);
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto size-14 text-green-600" />
        <h1 className="mt-4 font-heading text-2xl font-bold">Booking Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you, {booking.customerName}. Your booking reference is below — our team will call
          you at {booking.customerPhone} shortly to confirm the details.
        </p>

        <div className="mt-6 rounded-xl bg-brand-grey/70 p-5">
          <p className="text-xs text-muted-foreground">Booking Number</p>
          <p className="font-heading text-2xl font-bold tracking-wide text-brand-royal">
            {booking.bookingNumber}
          </p>
          <Badge className="mt-2" variant="secondary">
            {BOOKING_STATUS_LABELS[booking.status as BookingStatus]}
          </Badge>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-3 text-left text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Vehicle / Package</dt>
            <dd className="font-medium">{booking.vehicle?.name ?? booking.package?.title}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Pickup</dt>
            <dd className="font-medium">
              {booking.pickupLocation} · {new Date(booking.pickupDate).toLocaleDateString("en-IN")}{" "}
              {booking.pickupTime}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Passengers</dt>
            <dd className="font-medium">{booking.passengers}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Total Amount</dt>
            <dd className="font-heading font-bold text-brand-royal">
              ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="outline">
            <a href={`tel:${COMPANY.primaryPhone}`}>
              <Phone className="size-4" /> Call Us
            </a>
          </Button>
          <Button asChild variant="outline">
            <a
              href={`https://wa.me/91${COMPANY.primaryPhone}?text=${encodeURIComponent(
                `Hi, I've just booked ${booking.bookingNumber}. Please confirm.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" /> WhatsApp Us
            </a>
          </Button>
          <Button asChild className="bg-brand-gradient text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
