"use client";

import { StaggerGroup, staggerItem } from "@/components/ui/reveal";
import { motion } from "framer-motion";

const STATS = [
  { value: "100%", label: "Custom, no templates" },
  { value: "2–4 Weeks", label: "Average time to launch" },
  { value: "$799", label: "Full ownership, no monthly fees" },
];

export function StatsBar() {
  return (
    <section className="relative my-20 border-y border-primary/60 bg-secondary px-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <StaggerGroup className="grid grid-cols-1 divide-y divide-primary/25 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="flex flex-col items-center gap-2 px-8 py-10 text-center"
            >
              <span className="text-3xl font-light tracking-tight text-primary sm:text-4xl">
                {stat.value}
              </span>
              <span className="text-sm text-foreground/75">{stat.label}</span>
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
