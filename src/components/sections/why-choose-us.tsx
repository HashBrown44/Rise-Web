"use client";

import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { WHY_US } from "@/lib/data/why-us";

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative isolate px-4 py-28 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/10 blur-[140px]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        <SectionHeading
          eyebrow="Why Rise Websites"
          title="Built different from the agencies you've dealt with before."
          description="No jargon, no vague promises — just a clear process built around getting you real results, fast."
          align="left"
        />

        <div className="flex flex-col">
          {WHY_US.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/5 py-8 first:border-t-0 sm:grid-cols-[120px_auto_1fr] sm:items-center sm:gap-10">
                <span className="font-[family-name:var(--font-heading)] text-3xl font-semibold text-white/10 transition-colors duration-500 group-hover:text-primary/40 sm:text-5xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface text-primary sm:flex">
                  <item.icon className="h-4 w-4" />
                </span>
                <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-6">
                  <h3 className="min-w-[220px] text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
