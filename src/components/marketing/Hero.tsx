"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-brand-slate">
      <Image
        src="https://picsum.photos/seed/varanasi-ghats-hero/1920/1080"
        alt="Ganga Aarti at Dashashwamedh Ghat, Varanasi"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-slate via-brand-slate/60 to-brand-slate/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-royal/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <span className="inline-block rounded-full border border-brand-gold-light/40 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-gold-light backdrop-blur-sm">
            25+ Years of Trusted Service
          </span>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Your Trusted Travel Partner in{" "}
            <span className="text-brand-gold-light">Varanasi</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-200">
            Premium car rentals, pilgrimage tours, and corporate travel across Kashi, Sarnath,
            Ayodhya & Prayagraj — with 24×7 support you can rely on.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-brand-gradient text-white shadow-lg hover:opacity-90"
            >
              <Link href="/book">Book Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:text-white"
            >
              <Link href="/book">
                <CreditCard className="size-4" /> Pay Online
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={`https://wa.me/91${COMPANY.primaryPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-brand-gold-light"
            >
              <MessageCircle className="size-4" /> WhatsApp Us
            </a>
            <a
              href={`tel:${COMPANY.primaryPhone}`}
              className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-brand-gold-light"
            >
              <Phone className="size-4" /> Call {COMPANY.primaryPhone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
