"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/admin/DataTable";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_TRANSITIONS,
  type BookingStatus,
} from "@/lib/constants";
import { updateBookingStatusAction } from "@/server/actions/adminActions";

type Booking = {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  vehicleName: string | null;
  packageTitle: string | null;
  pickupDate: string;
  totalAmount: number;
  status: string;
};

export function BookingsManager({
  bookings,
  drivers,
}: {
  bookings: Booking[];
  drivers: { id: string; name: string }[];
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [nextStatus, setNextStatus] = useState<Record<string, BookingStatus>>({});
  const [driverChoice, setDriverChoice] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  function applyStatus(bookingId: string) {
    const status = nextStatus[bookingId];
    if (!status) return;
    if (status === "assigned" && !driverChoice[bookingId]) {
      toast.error("Select a driver to assign");
      return;
    }
    setPendingId(bookingId);
    startTransition(async () => {
      const result = await updateBookingStatusAction({
        bookingId,
        status,
        driverId: status === "assigned" ? driverChoice[bookingId] : undefined,
      });
      if (result.ok) toast.success(`Booking moved to ${BOOKING_STATUS_LABELS[status]}`);
      else toast.error(result.error);
      setPendingId(null);
    });
  }

  const columns: Column<Booking>[] = [
    {
      header: "Booking",
      cell: (b) => (
        <div>
          <p className="font-medium">{b.bookingNumber}</p>
          <p className="text-xs text-muted-foreground">
            {b.vehicleName ?? b.packageTitle ?? "—"}
          </p>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: (b) => (
        <div>
          <p className="text-sm">{b.customerName}</p>
          <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
        </div>
      ),
    },
    {
      header: "Pickup",
      cell: (b) => new Date(b.pickupDate).toLocaleDateString("en-IN"),
    },
    { header: "Amount", cell: (b) => `₹${b.totalAmount.toLocaleString("en-IN")}` },
    {
      header: "Status",
      cell: (b) => (
        <Badge variant="secondary">{BOOKING_STATUS_LABELS[b.status as BookingStatus]}</Badge>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={bookings}
      actions={(b) => {
        const allowed = BOOKING_STATUS_TRANSITIONS[b.status as BookingStatus];
        if (allowed.length === 0) return null;
        return (
          <div className="flex items-center justify-end gap-2">
            <Select
              value={nextStatus[b.id]}
              onValueChange={(v) => setNextStatus((s) => ({ ...s, [b.id]: v as BookingStatus }))}
            >
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Change to…" />
              </SelectTrigger>
              <SelectContent>
                {allowed.map((s) => (
                  <SelectItem key={s} value={s}>
                    {BOOKING_STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {nextStatus[b.id] === "assigned" && (
              <Select
                value={driverChoice[b.id]}
                onValueChange={(v) => setDriverChoice((s) => ({ ...s, [b.id]: v }))}
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Driver…" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              size="sm"
              disabled={!nextStatus[b.id] || (pending && pendingId === b.id)}
              onClick={() => applyStatus(b.id)}
            >
              Apply
            </Button>
          </div>
        );
      }}
    />
  );
}
