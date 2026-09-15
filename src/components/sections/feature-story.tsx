"use client";

import { Rocket, ShieldCheck, Timer } from "lucide-react";
import { StarField } from "@/components/ui/star-field";
import { Reveal, WipeReveal } from "@/components/ui/reveal";

const FEATURES = [
  {
    icon: Rocket,
    title: "A site that actually converts",
    description: "Fast, mobile-first, and built to turn visitors into customers — not just look pretty.",
  },
  {
    icon: Timer,
    title: "Built fast, built right",
    description: "Most projects launch in 2–4 weeks, hand-coded and tested on real devices before they go live.",
  },
  {
    icon: ShieldCheck,
    title: "Real ownership, no strings",
    description: "Your site, your domain, your content. Pay once and it's yours — no monthly lock-in required.",
  },
];

export function FeatureStory() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-28 sm:px-8">
      <div className="absolute inset-0 -z-10 bg-background" />
      <div className="nebula-cloud absolute inset-0 -z-10 opacity-50" />
      <StarField density={90} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="mx-auto flex max-w-3xl flex-col gap-14">
        <div className="flex flex-col gap-5">
          <Reveal>
            <span className="label-mono inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-highlight">
              What We Build
            </span>
          </Reveal>
          <WipeReveal delay={0.08}>
            <h2 className="max-w-xl text-balance font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              More than a <span className="text-gradient">pretty site.</span>
            </h2>
          </WipeReveal>
        </div>

        <div className="flex flex-col">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <div className="flex items-start gap-5 border-t border-white/5 py-7 first:border-t-0">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{feature.title}</h3>
                  <p className="max-w-md text-sm leading-relaxed text-muted">{feature.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
