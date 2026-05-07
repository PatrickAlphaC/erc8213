import type { MetadataRoute } from "next";

// Required when output: 'export' — emit at build time, not on a request.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://erc8213.org/sitemap.xml",
  };
}
