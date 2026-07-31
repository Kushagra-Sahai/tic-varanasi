"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Car,
  Package,
  CalendarCheck,
  Mail,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/enquiries", label: "Enquiries", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; role: string };
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-brand-grey/30">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="font-heading text-xl font-bold text-brand-gradient">
            TIC Admin
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-royal text-white"
                    : "text-foreground/80 hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-3 flex items-center gap-2 text-sm text-destructive hover:underline"
          >
            <LogOut className="size-4" /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
          <span className="font-heading text-lg font-bold text-brand-gradient">TIC Admin</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-destructive"
          >
            Sign Out
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
