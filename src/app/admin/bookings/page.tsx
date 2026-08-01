import { listBookings } from "@/server/services/bookingService";
import { listAvailableDrivers } from "@/server/services/driverService";
import { BookingsManager } from "@/components/admin/BookingsManager";

export default async function AdminBookingsPage() {
  const [bookings, drivers] = await Promise.all([listBookings(), listAvailableDrivers()]);

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
            pickupDate: b.pickupDate,
            totalAmount: b.totalAmount,
            status: b.status,
          }))}
          drivers={drivers.map((d) => ({ id: d.id, name: d.name }))}
        />
      </div>
    </div>
  );
}
