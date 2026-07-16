import {
  LayoutTemplate,
  RefreshCcw,
  Search,
  Smartphone,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    icon: LayoutTemplate,
    title: "Custom Website Design",
    description:
      "A ground-up, brand-matched design built to convert visitors — never a recycled template.",
  },
  {
    icon: RefreshCcw,
    title: "Website Redesign",
    description:
      "Modernize an outdated site into a fast, premium experience without losing your SEO equity.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Technical and on-page foundations that help local customers find you first.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimization",
    description: "Pixel-perfect across every device — most of your customers are on their phone.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description: "Layouts, copy, and CTAs engineered around one goal: turning visitors into leads.",
  },
  {
    icon: Wrench,
    title: "Website Maintenance",
    description: "Ongoing updates, monitoring, and support so your site stays fast and secure.",
  },
];
