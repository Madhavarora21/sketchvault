import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Excalidraw ES module package hai, isliye transpile karna zaroori hai
  transpilePackages: ["@excalidraw/excalidraw"],
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