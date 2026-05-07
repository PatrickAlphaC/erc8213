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
};

export default nextConfig;
