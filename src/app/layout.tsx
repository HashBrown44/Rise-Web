import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { CustomCursor } from "@/components/ui/cursor";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { FloatingWidget } from "@/components/ui/floating-widget";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
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
  metadataBase: new URL("https://risewebsite.com"),
  title: {
    default: "Rise Websites — Websites Built To Grow Your Business",
    template: "%s | Rise Websites",
  },
  description:
    "Rise Websites designs and builds high-converting, premium websites for local businesses. Custom design, SEO foundations, and ongoing support with no surprises.",
  keywords: [
    "web design agency",
    "website design",
    "local business websites",
    "custom web development",
    "SEO optimization",
  ],
  openGraph: {
    title: "Rise Websites — Websites Built To Grow Your Business",
    description:
      "High-converting, premium websites for local businesses. Custom design, SEO foundations, and ongoing support.",
    type: "website",
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
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
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
