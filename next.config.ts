import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allow large file uploads (2GB)
  experimental: {
    serverActions: {
      bodySizeLimit: '2000mb',
    },
    optimizePackageImports: ['lucide-react', 'date-fns', 'framer-motion'],
  },
  // External packages that shouldn't be bundled
  serverExternalPackages: ['bullmq', 'ioredis'],
};

export default nextConfig;
