"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/car-rental", label: "Car Rental" },
  { href: "/tour-packages", label: "Tour Packages" },
  { href: "/destinations", label: "Destinations" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-heading text-xl font-bold text-brand-gradient sm:text-2xl">
            TIC
          </span>
          <span className="hidden text-sm font-medium text-muted-foreground sm:inline">
            Travel Info Centre
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                pathname === link.href ? "text-primary" : "text-foreground/80",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${COMPANY.primaryPhone}`}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-primary"
          >
            <Phone className="size-4" />
            {COMPANY.primaryPhone}
          </a>
          <Button asChild className="bg-brand-gradient text-white shadow-md hover:opacity-90">
            <Link href="/book">Book Now</Link>
          </Button>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-base font-medium",
                  pathname === link.href ? "bg-muted text-primary" : "text-foreground/80",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-brand-gradient text-white">
              <Link href="/book" onClick={() => setOpen(false)}>
                Book Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
