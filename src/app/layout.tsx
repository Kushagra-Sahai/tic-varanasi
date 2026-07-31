import type { Metadata } from "next";
import { Playfair_Display, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/providers/SessionProvider";

const heading = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ticvaranasi.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Travel Info Centre (TIC) Varanasi | Trusted Travel Partner Since 25+ Years",
    template: "%s | Travel Info Centre (TIC) Varanasi",
  },
  description:
    "Premium car rentals, pilgrimage tours, corporate travel and guide services in Varanasi, Sarnath, Ayodhya & Prayagraj. 25+ years of trusted service, 24x7 support.",
  keywords: [
    "Varanasi taxi",
    "Kashi Vishwanath tour",
    "Varanasi car rental",
    "Ganga Aarti tour package",
    "Sarnath tour",
    "Ayodhya tour package",
    "Travel Info Centre Varanasi",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Travel Info Centre (TIC) Varanasi",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SessionProvider>{children}</SessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
