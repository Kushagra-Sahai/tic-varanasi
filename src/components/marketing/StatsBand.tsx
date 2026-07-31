import { ShieldCheck, Clock, Car, Building2 } from "lucide-react";

const STATS = [
  { icon: ShieldCheck, value: "25+", label: "Years Trusted Service" },
  { icon: Clock, value: "24×7", label: "Customer Support" },
  { icon: Car, value: "50+", label: "Luxury Fleet Vehicles" },
  { icon: Building2, value: "500+", label: "Corporate Clients" },
];

export function StatsBand() {
  return (
    <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur-md sm:grid-cols-4 sm:p-8">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-brand-royal/10 text-brand-royal">
              <Icon className="size-6" />
            </div>
            <p className="font-heading text-2xl font-bold sm:text-3xl">{value}</p>
            <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
