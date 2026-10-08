import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Built once at deploy time from the routes in src/app.
export const dynamic = "force-static";

const APP_DIR = path.join(process.cwd(), "src", "app");
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

/** Routes that exist but must stay out of the sitemap (add paths like "/thank-you"). */
const NOINDEX_ROUTES = new Set<string>([]);

/**
 * Walks src/app and returns every static, public page route. Skips API routes,
 * dynamic segments ([id]) that have no single canonical URL, private folders
 * (_components), parallel/intercepting routes, and NOINDEX_ROUTES. Route
 * groups like (marketing) are folded into their parent path.
 */
function collectRoutes(dir: string, segments: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];

  if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
    routes.push("/" + segments.join("/"));
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name === "api" || name.startsWith("_") || name.startsWith("@") || name.startsWith("(.")) continue;
    if (name.startsWith("[")) continue;
    const isGroup = name.startsWith("(") && name.endsWith(")");
    routes.push(...collectRoutes(path.join(dir, name), isGroup ? segments : [...segments, name]));
  }

  return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return collectRoutes(APP_DIR)
    .filter((route) => !NOINDEX_ROUTES.has(route))
    .sort()
    .map((route) => ({
      url: absoluteUrl(route),
      lastModified,
      changeFrequency: "weekly",
      priority: route === "/" ? 1 : 0.7,
    }));
}
