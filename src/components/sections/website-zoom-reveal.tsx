"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WebsiteZoomReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    // Pinned scroll-jack zoom only on tablet+ — this kind of pinned section is a
    // common source of jank on touch devices, so mobile just gets a static view.
    mm.add("(min-width: 768px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(textRef.current, { opacity: 0, y: -40, ease: "power1.in" }, 0).to(
          mockupRef.current,
          { scale: 7, ease: "power1.inOut" },
          0,
        );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex h-screen w-full items-center justify-center overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.14),transparent_60%)]" />

      <div ref={mockupRef} className="relative w-full max-w-3xl px-4 will-change-transform">
        <div className="glass overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_140px_-30px_rgba(0,229,255,0.4)]">
          <div className="flex items-center gap-1.5 border-b border-white/5 px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
          </div>
          <div className="space-y-4 bg-surface/80 p-10 sm:p-14">
            <div className="h-4 w-2/3 rounded-full bg-gradient-to-r from-primary to-secondary opacity-90" />
            <div className="h-2.5 w-full rounded-full bg-white/10" />
            <div className="h-2.5 w-5/6 rounded-full bg-white/10" />
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-24 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02]" />
              ))}
            </div>
            <div className="mt-6 h-11 w-40 rounded-full bg-gradient-to-r from-primary to-highlight" />
          </div>
        </div>
      </div>

      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-highlight">
          See It Live
        </span>
        <h2 className="max-w-2xl font-[family-name:var(--font-heading)] text-4xl font-semibold leading-tight sm:text-5xl">
          A website built to <span className="text-gradient">convert</span> your customers.
        </h2>
        <p className="text-sm uppercase tracking-[0.3em] text-muted">Scroll to look inside</p>
      </div>
    </section>
  );
}
