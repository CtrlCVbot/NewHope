import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/v3/saesomang/images/*.webp", search: "?v=wu18-20261015" },
    ],
  },
};

export default nextConfig;
