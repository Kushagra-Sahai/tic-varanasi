import { db } from "@/lib/db";
import { BookingsManager } from "@/components/admin/BookingsManager";

export default async function AdminBookingsPage() {
  const [bookings, drivers] = await Promise.all([
    db.booking.findMany({
      include: { vehicle: true, package: true },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    db.driver.findMany({ include: { user: true }, where: { isAvailable: true } }),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Bookings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Track and update every booking through its lifecycle.
      </p>
      <div className="mt-6">
        <BookingsManager
          bookings={bookings.map((b) => ({
            id: b.id,
            bookingNumber: b.bookingNumber,
            customerName: b.customerName,
            customerPhone: b.customerPhone,
            vehicleName: b.vehicle?.name ?? null,
            packageTitle: b.package?.title ?? null,
            pickupDate: b.pickupDate.toISOString(),
            totalAmount: Number(b.totalAmount),
            status: b.status,
          }))}
          drivers={drivers.map((d) => ({ id: d.id, name: d.user.name }))}
        />
      </div>
    </div>
  );
}
