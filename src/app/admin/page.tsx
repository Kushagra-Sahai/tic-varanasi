import { Car, Package, CalendarCheck, Mail, IndianRupee } from "lucide-react";
import { readCollection } from "@/lib/jsondb";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/constants";
import type { Booking, ContactEnquiry, Package as PackageEntity, Vehicle } from "@/lib/entities";

async function getDashboardStats() {
  const [vehicles, packages, bookings, enquiries] = await Promise.all([
    readCollection<Vehicle>("vehicles"),
    readCollection<PackageEntity>("packages"),
    readCollection<Booking>("bookings"),
    readCollection<ContactEnquiry>("contactEnquiries"),
  ]);

  const revenueStatuses = new Set(["completed", "confirmed", "assigned"]);
  const revenue = bookings
    .filter((b) => revenueStatuses.has(b.status))
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const countsByStatus = new Map<string, number>();
  for (const b of bookings) {
    countsByStatus.set(b.status, (countsByStatus.get(b.status) ?? 0) + 1);
  }
  const bookingsByStatus = [...countsByStatus.entries()].map(([status, count]) => ({
    status,
    count,
  }));

  return {
    vehicleCount: vehicles.filter((v) => v.isActive).length,
    packageCount: packages.filter((p) => p.isActive).length,
    bookingCount: bookings.length,
    unreadEnquiries: enquiries.filter((e) => !e.isRead).length,
    bookingsByStatus,
    revenue,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Active Vehicles", value: stats.vehicleCount, icon: Car },
    { label: "Active Packages", value: stats.packageCount, icon: Package },
    { label: "Total Bookings", value: stats.bookingCount, icon: CalendarCheck },
    { label: "Unread Enquiries", value: stats.unreadEnquiries, icon: Mail },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of your fleet, packages and bookings.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-5 text-brand-royal" />
            </div>
            <p className="mt-2 font-heading text-3xl font-bold">{value}</p>
          </div>
        ))}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Revenue (confirmed & completed)</p>
            <IndianRupee className="size-5 text-brand-royal" />
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-brand-royal">
            ₹{stats.revenue.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-heading text-lg font-semibold">Bookings by Status</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {stats.bookingsByStatus.map((row) => (
            <div key={row.status} className="rounded-xl bg-brand-grey/60 p-4 text-center">
              <p className="font-heading text-2xl font-bold">{row.count}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {BOOKING_STATUS_LABELS[row.status as BookingStatus]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
