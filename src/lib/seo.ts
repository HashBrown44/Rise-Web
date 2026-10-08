import type { Metadata } from "next";
import { SITE } from "@/lib/data/site";

export const SITE_URL = SITE.url;

/**
 * True only for the real production deploy. Vercel sets VERCEL_ENV at build
 * time ("production" | "preview" | "development"); outside Vercel we fall back
 * to NODE_ENV so a self-hosted `next build` is treated as production.
 * Everything else (preview/staging) is kept out of search indexes.
 */
export const IS_PRODUCTION_DEPLOY = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

/** Absolute URL for a path. The home page is written without a trailing slash
 *  so it matches the canonical tag Next.js emits for "/". */
export function absoluteUrl(path: string) {
  const url = new URL(path, SITE_URL).toString();
  return path === "/" ? url.replace(/\/$/, "") : url;
}

type PageSeo = {
  /** Route path, e.g. "/" or "/about". Used for the canonical URL. */
  path: string;
  /** Unique, page-specific title. */
  title: string;
  /** Unique, page-specific meta description (aim for 120–160 characters). */
  description: string;
  /** Use the title as-is instead of applying the root "%s | Rise Websites" template. */
  absoluteTitle?: boolean;
};

/**
 * Per-page metadata: self-referencing absolute canonical, title, description
 * and matching Open Graph / Twitter tags. Every page.tsx should export
 * `metadata = pageMetadata({...})` so no page inherits another page's tags.
 */
export function pageMetadata({ path, title, description, absoluteTitle }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: SITE.name,
      locale: "en_US",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
