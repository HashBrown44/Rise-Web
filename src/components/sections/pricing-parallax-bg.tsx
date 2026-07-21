"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PricingParallaxBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const orbCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      timeline
        .fromTo(
          orbARef.current,
          { scale: 0.7, xPercent: -8, yPercent: -6 },
          { scale: 1.6, xPercent: 6, yPercent: 4, ease: "none" },
          0,
        )
        .fromTo(
          orbBRef.current,
          { scale: 0.9, xPercent: 10, yPercent: -4 },
          { scale: 1.35, xPercent: -10, yPercent: 8, ease: "none" },
          0,
        )
        .fromTo(
          orbCRef.current,
          { scale: 1.1, xPercent: -4, yPercent: 10 },
          { scale: 0.75, xPercent: 6, yPercent: -8, ease: "none" },
          0,
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden">
      <div
        ref={orbARef}
        className="absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px] will-change-transform"
      />
      <div
        ref={orbBRef}
        className="absolute right-[10%] top-1/4 h-[380px] w-[600px] rounded-full bg-secondary/15 blur-[140px] will-change-transform"
      />
      <div
        ref={orbCRef}
        className="absolute left-[8%] bottom-[10%] h-[340px] w-[560px] rounded-full bg-highlight/10 blur-[130px] will-change-transform"
      />
    </div>
  );
}
