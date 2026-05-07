import type { MetadataRoute } from "next";

// Required when output: 'export' — emit at build time, not on a request.
export const dynamic = "force-static";

const BASE_URL = "https://erc8213.org";

export default function sitemap(): MetadataRoute.Sitemap {
  // `lastModified` is omitted intentionally. Stamping `new Date()` here
  // would make every build produce a different sitemap.xml (and therefore
  // a different IPFS CID). Crawlers fall back to HTTP fetch metadata when
  // lastmod is missing, which is fine for a small site.
  return ["", "/wallets", "/implement", "/verify", "/compute"].map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1.0 : 0.8,
  }));
}
