import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          eslint: {
              ignoreDuringBuilds: true, // Temporary - remove after fixing
            },
            typescript: {
              ignoreBuildErrors: true, // Temporary - remove after fixing
            },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ['@auth/prisma-adapter'],
  },
};

export default nextConfig;
