"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { PORTFOLIO_CATEGORIES, PORTFOLIO_PROJECTS, type PortfolioCategory } from "@/lib/data/portfolio";
import { cn } from "@/lib/utils";

export function Portfolio() {
  const [active, setActive] = useState<PortfolioCategory>("All");
  const trackRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (active === "All" ? PORTFOLIO_PROJECTS : PORTFOLIO_PROJECTS.filter((p) => p.category === active)),
    [active],
  );

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = (card?.offsetWidth ?? 400) + 24;
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section id="portfolio" className="relative py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 sm:px-8">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Our Work"
            title="Real businesses. Real results."
            description="A look at the kind of premium, conversion-focused websites we build (representative sample projects)."
            align="left"
            className="sm:items-start sm:text-left"
          />
          <div className="hidden shrink-0 gap-3 sm:flex">
            <button
              onClick={() => scrollByCard(-1)}
              data-cursor-hover
              aria-label="Scroll left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              data-cursor-hover
              aria-label="Scroll right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:justify-start">
          {PORTFOLIO_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              data-cursor-hover
              className={cn(
                "relative isolate rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300",
                active === category
                  ? "border-primary/50 text-background"
                  : "border-white/10 text-muted hover:text-foreground",
              )}
            >
              {active === category && (
                <motion.span
                  layoutId="portfolio-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary to-highlight"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {category}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="shrink-0 lg:basis-[calc((100%-72rem)/2)]" aria-hidden />
        {filtered.map((project) => (
          <div
            key={project.name}
            data-card
            className="group relative w-[86%] shrink-0 snap-center overflow-hidden rounded-3xl border border-white/10 bg-surface/60 sm:w-[60%] lg:w-[46%]"
          >
            <div className={cn("relative h-72 overflow-hidden bg-gradient-to-br sm:h-80", project.gradient)}>
              <div className="absolute inset-6 rounded-2xl border border-white/10 bg-surface-2/70 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105">
                <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                </div>
                <div className="space-y-3 p-6">
                  <div className="h-2.5 w-1/2 rounded-full bg-white/15" />
                  <div className="h-2.5 w-full rounded-full bg-white/10" />
                  <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-background/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-foreground">
                  View Case Study <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 p-7">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{project.category}</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">{project.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 px-7 py-4">
              <span className="text-sm font-semibold text-primary">{project.result}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
