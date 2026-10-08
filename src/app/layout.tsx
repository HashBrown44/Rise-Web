import type { Metadata } from "next";
import { Italiana, Sora, IBM_Plex_Mono } from "next/font/google";
import { CustomCursor } from "@/components/ui/cursor";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { FloatingWidget } from "@/components/ui/floating-widget";
import { SITE } from "@/lib/data/site";
import { IS_PRODUCTION_DEPLOY, SITE_URL } from "@/lib/seo";
import "./globals.css";

const italiana = Italiana({
  variable: "--font-italiana",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Fallbacks only: every page exports its own title, description and
  // canonical via pageMetadata() in src/lib/seo.ts.
  title: {
    default: "Rise Websites — Websites Built To Grow Your Business",
    template: "%s | Rise Websites",
  },
  description:
    "Rise Websites designs and builds high-converting, premium websites for local businesses. Custom design, SEO foundations, and ongoing support with no surprises.",
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  // Preview/staging deploys are never indexed (robots.txt blocks them too).
  robots: IS_PRODUCTION_DEPLOY
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
  verification: {
    google: "1_bGZct-sh_3lVxHcUfPS1ExZ6VgsoAz8zG4J8O6mZM",
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
      className={`${italiana.variable} ${sora.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-background text-foreground selection:bg-primary">
        <LoadingScreen />
        <CustomCursor />
        {children}
        <FloatingWidget />
      </body>
    </html>
  );
}
