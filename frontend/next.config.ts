import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'contents.mediadecathlon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.mediadecathlon.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
