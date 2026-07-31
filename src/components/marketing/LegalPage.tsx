export function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Last updated: {updatedAt}</p>
      <div className="prose prose-slate mt-8 max-w-none space-y-4 text-sm leading-relaxed text-foreground/90 [&_h2]:font-heading [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold">
        {children}
      </div>
    </div>
  );
}
