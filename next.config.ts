import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Bypass Next.js image optimization for Supabase
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "ncafqydkhyjzjvcfghwv.supabase.co",
      },
    ],
  },
};

export default nextConfig;
