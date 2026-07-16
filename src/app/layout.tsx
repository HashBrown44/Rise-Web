import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { CustomCursor } from "@/components/ui/cursor";
import { LoadingScreen } from "@/components/ui/loading-screen";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://risewebsites.com"),
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
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="grain min-h-full flex flex-col bg-background text-foreground selection:bg-primary">
        <LoadingScreen />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
