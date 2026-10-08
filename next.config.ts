import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF where supported, WebP otherwise (originals stay as JPG/PNG).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
