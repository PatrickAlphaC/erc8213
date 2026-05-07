import type { NextConfig } from "next";

// Path-style IPFS gateways (e.g. gateway.pinata.cloud/ipfs/<CID>/) serve the
// site under a sub-path, so absolute asset URLs like /_next/static/... 404
// at the gateway root. Setting assetPrefix to "./" emits relative URLs that
// resolve correctly under the CID, at the cost of working slightly less
// well with deeply-nested routes — fine for our flat site.
const assetPrefix =
  process.env.NEXT_PUBLIC_IPFS_BUILD === "true" ? "./" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  assetPrefix,
  images: { unoptimized: true },
  // Make the buildId deterministic so two builds with identical inputs
  // produce identical `out/` trees (and therefore identical IPFS CIDs).
  // By default Next emits a random buildId per `next build` — that random
  // string gets baked into manifests and chunk paths, so every build
  // would otherwise differ from every other one.
  generateBuildId: () =>
    Promise.resolve(process.env.NEXT_PUBLIC_VERSION ?? "dev"),
};

export default nextConfig;
