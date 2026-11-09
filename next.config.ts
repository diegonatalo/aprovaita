import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // site 100% estático (Vercel ou qualquer hospedagem)
  trailingSlash: true,
  images: { unoptimized: true },
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
