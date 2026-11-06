import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Kept minimal on purpose: the auth layer relies on request-time cookies
  // (middleware + server components), so the default rendering model is what
  // we want here rather than strict cache components.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
