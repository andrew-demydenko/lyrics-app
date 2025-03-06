/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {},
  experimental: {
    staleTimes: {
      dynamic: 30, // default is 30
      static: 180,
    },
  },
};

export default nextConfig;
