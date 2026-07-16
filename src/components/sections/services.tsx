"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { SERVICES } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function Services() {
  return (
    <section id="services" className="relative py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 sm:px-8">
        <SectionHeading
          eyebrow="What We Do"
          title="Every service you need to win online."
          description="From first pixel to ongoing growth, Rise Websites covers the full lifecycle of a high-performing website."
        />
      </div>

      <div className="mt-4 flex flex-col">
        {SERVICES.map((service, index) => (
          <Reveal key={service.title} delay={0.05}>
            <div className="border-t border-white/5 py-14 first:border-t-0">
              <div
                className={cn(
                  "mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 sm:px-8 lg:flex-row lg:gap-16",
                  index % 2 === 1 && "lg:flex-row-reverse",
                )}
              >
                <div className="flex-1">
                  <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{service.title}</h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted">{service.description}</p>
                  <a
                    href="#pricing"
                    data-cursor-hover
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </div>

                <ServiceVisual icon={service.icon} index={index} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceVisual({ icon: Icon, index }: { icon: (typeof SERVICES)[number]["icon"]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-56 w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-surface/60 sm:h-64 lg:w-[420px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.14),transparent_70%)] transition-opacity duration-500 group-hover:opacity-150" />
      <div className="absolute inset-6 rounded-2xl border border-white/5" />
      <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-highlight">
        <Icon className="h-9 w-9" />
      </span>
      <span className="absolute bottom-4 right-5 font-[family-name:var(--font-heading)] text-6xl font-semibold text-white/[0.04]">
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
