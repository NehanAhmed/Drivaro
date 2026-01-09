import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://example.com/images/**')],
  },
};

export default nextConfig;
