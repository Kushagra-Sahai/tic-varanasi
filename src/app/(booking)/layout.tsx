import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-heading text-xl font-bold text-brand-gradient">
            TIC
          </Link>
          <a
            href={`tel:${COMPANY.primaryPhone}`}
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Need help? Call {COMPANY.primaryPhone}
          </a>
        </div>
      </header>
      <main className="flex-1 bg-brand-grey/30 py-10">{children}</main>
    </>
  );
}
