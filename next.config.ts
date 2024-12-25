import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/explore/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      },
    ];
  },
};

export default nextConfig;
