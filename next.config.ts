import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Letakkan langsung di sini, tanpa experimental
  allowedDevOrigins: ["10.94.171.202", "localhost:3000"],

  reactStrictMode: true,

  cacheComponents: true,

  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;