import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Albanian is the site's default language, so the old `/sq` address now
  // resolves there and English lives at `/en`.
  async redirects() {
    return [{ source: "/sq", destination: "/", permanent: true }];
  },
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
