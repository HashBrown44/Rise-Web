"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function GlowOrbBg() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        orbRef.current,
        { scale: 0.85, rotate: -6 },
        {
          scale: 1.08,
          rotate: 6,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
      <div
        ref={orbRef}
        className="h-[560px] w-[560px] rounded-full will-change-transform"
        style={{
          background: [
            "radial-gradient(ellipse 55% 50% at 32% 38%, rgba(31,107,71,0.42), transparent 65%)",
            "radial-gradient(ellipse 50% 55% at 68% 42%, rgba(184,147,63,0.22), transparent 68%)",
            "radial-gradient(ellipse 45% 42% at 52% 68%, rgba(15,61,39,0.45), transparent 70%)",
          ].join(", "),
          filter: "blur(42px)",
        }}
      />
    </div>
  );
}
