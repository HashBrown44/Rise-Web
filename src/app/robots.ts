import type { MetadataRoute } from "next";
import { IS_PRODUCTION_DEPLOY, SITE_URL } from "@/lib/seo";

// Generated once at build time. Production deploys get the real robots.txt;
// preview/staging deploys get one that blocks all crawling, so the swap
// happens automatically on every deploy with no manual step.
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION_DEPLOY) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      // ChatGPT search results: allowed.
      { userAgent: "OAI-SearchBot", allow: "/", disallow: "/api/" },
      // OpenAI model training crawler: blocked.
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
