<<<<<<< HEAD
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
=======
// next.config.js

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1", // Explicitly allowing IPv4 loopback
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "::1", // Explicitly allowing IPv6 loopback
        port: "8000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
>>>>>>> 5a20e0c6e01095d588952b8cca9e49ee2071e1f4
