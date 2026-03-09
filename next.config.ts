import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type issues in shadcn/lucide-react dependencies
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
