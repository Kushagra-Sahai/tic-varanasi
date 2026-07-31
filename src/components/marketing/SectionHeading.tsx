import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-2xl",
        align === "center" ? "text-center" : "text-left mx-0",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-block rounded-full bg-brand-gold-light/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">{description}</p>
      )}
    </div>
  );
}
