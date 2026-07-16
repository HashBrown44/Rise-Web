import { Gauge, Layers, Search, ShieldCheck, Smartphone, Sparkles, type LucideIcon } from "lucide-react";

export type WhyUsItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const WHY_US: WhyUsItem[] = [
  {
    icon: Gauge,
    title: "Fast Turnaround",
    description: "Most projects launch in 2–4 weeks, not months — without cutting corners.",
  },
  {
    icon: Sparkles,
    title: "Modern Design",
    description: "Clean, current, on-brand design that makes your business look as good as it is.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Every site is built mobile-first and tested across real devices before launch.",
  },
  {
    icon: Search,
    title: "SEO Ready",
    description: "Structured, fast, and indexable from day one so search engines can find you.",
  },
  {
    icon: ShieldCheck,
    title: "Ownership of Your Website",
    description: "It's your site, your domain, your content — no lock-in, ever.",
  },
  {
    icon: Layers,
    title: "Ongoing Support",
    description: "Real humans available after launch for edits, updates, and questions.",
  },
];
