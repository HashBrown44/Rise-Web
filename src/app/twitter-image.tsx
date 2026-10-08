import { renderSocialImage } from "@/lib/social-image";

export const alt = "Rise Websites — Websites Built To Grow Your Business";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderSocialImage(size);
}
