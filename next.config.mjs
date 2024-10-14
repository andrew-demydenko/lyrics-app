/** @type {import('next').NextConfig} */
import path from "path";

const nextConfig = {
  reactStrictMode: false,
  sassOptions: {},
  experimental: {
    staleTimes: {
      dynamic: 30, // default is 30
      static: 180,
    },
  },
};

export default nextConfig;
