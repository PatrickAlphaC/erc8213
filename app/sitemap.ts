import type { MetadataRoute } from "next";

// Required when output: 'export' — emit at build time, not on a request.
export const dynamic = "force-static";

const BASE_URL = "https://erc8213.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ["", "/wallets", "/implement", "/verify", "/compute"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
