"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { WHY_US } from "@/lib/data/why-us";

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current;
        const section = sectionRef.current;
        const viewport = viewportRef.current;
        if (!track || !section || !viewport) return;

        // Use the track's own overflow-hidden viewport width, not the section's —
        // the viewport sits inside a padded container, so it's narrower than the
        // section, and using the section's width undershoots the scroll distance,
        // leaving the last card never fully visible.
        const distance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 1,
            pin: true,
            pinType: "fixed",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="relative isolate z-10 bg-background px-4 py-28 sm:px-8 md:flex md:h-screen md:flex-col md:justify-center md:overflow-hidden md:py-0"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="nebula-cloud absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 opacity-60" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-16 md:max-w-none md:px-[8vw]">
        <SectionHeading
          eyebrow="Why Rise Websites"
          title="Built different from the agencies you've dealt with before."
          description="No jargon, no vague promises — just a clear process built around getting you real results, fast."
          align="left"
        />

        {/* Mobile: static vertical list */}
        <div className="flex flex-col md:hidden">
          {WHY_US.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="group grid grid-cols-[auto_1fr] items-start gap-6 border-t border-white/5 py-8 first:border-t-0">
                <span className="font-[family-name:var(--font-mono)] text-3xl font-semibold text-white/10 transition-colors duration-500 group-hover:text-primary/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-semibold tracking-tight">{item.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Desktop: pinned horizontal reveal */}
        <div ref={viewportRef} className="hidden md:block md:overflow-hidden">
          <div ref={trackRef} className="flex gap-8 will-change-transform">
            {WHY_US.map((item, index) => (
              <div
                key={item.title}
                className="glass flex w-[400px] shrink-0 flex-col gap-6 rounded-3xl border border-white/10 p-10"
              >
                <span className="font-[family-name:var(--font-mono)] text-sm text-highlight">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-surface text-primary">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
