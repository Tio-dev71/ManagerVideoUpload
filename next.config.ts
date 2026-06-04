import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow large file uploads (500MB)
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
  },
  // External packages that shouldn't be bundled
  serverExternalPackages: ['bullmq', 'ioredis'],
};

export default nextConfig;
