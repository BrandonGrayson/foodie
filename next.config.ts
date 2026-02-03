import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.pexels.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "foodieitems.s3.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
