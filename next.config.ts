import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ allows build even with TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables linting during build
  },
};

export default nextConfig;
