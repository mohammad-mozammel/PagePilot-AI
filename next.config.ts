import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: 'xre0b3beuotbfimr.public.blob.vercel-storage.com',
      },
    ]
  }
};

export default nextConfig;
