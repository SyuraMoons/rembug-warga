import type { NextConfig } from "next";

// Cache Components sengaja TIDAK diaktifkan: semua halaman data dirender per-request
// (dynamic) agar hasil voting selalu terbaru dan model mentalnya sederhana bagi tim.
const nextConfig: NextConfig = {
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
