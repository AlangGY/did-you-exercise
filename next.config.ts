import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // rewrites: async () => {
  //   return [
  //     {
  //       source: "/:path*",
  //       destination: "/main/:path*",
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "figkvtvtxvzuyqokfxzz.supabase.co",
      },
    ],
  },
};

export default nextConfig;
