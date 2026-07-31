import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="font-heading text-7xl font-bold text-brand-gradient">404</span>
        <h1 className="mt-4 font-heading text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Button asChild className="mt-6 bg-brand-gradient text-white">
          <Link href="/">Back to Home</Link>
        </Button>
      </main>
      <SiteFooter />
    </>
  );
}
