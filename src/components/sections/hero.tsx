"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { StarField } from "@/components/ui/star-field";
import { HeroQuoteForm } from "@/components/sections/hero-quote-form";
import { cn } from "@/lib/utils";

const HEADLINE_LINES = ["Websites Built To", "Grow Your Business."];

const TRUST_ITEMS = [{ icon: ShieldCheck, label: "Full ownership, always" }];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  const lightBackground = useMotionTemplate`radial-gradient(700px circle at ${smoothX}px ${smoothY}px, rgba(216,184,98,0.08), transparent 60%)`;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-32 pb-24"
    >
      <div className="nebula-cloud absolute inset-0 -z-20 opacity-70" />
      <StarField />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: lightBackground }}
      />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 text-center sm:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="label-mono inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-highlight"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Premium Web Design Agency
        </motion.span>

        <h1 className="font-[family-name:var(--font-heading)] text-4xl uppercase leading-[1.02] sm:text-5xl lg:text-7xl 2xl:text-8xl">
          {HEADLINE_LINES.map((line, lineIndex) => (
            // CSS (not JS) animation: the headline is the page's LCP element, so
            // it must paint on first render rather than wait for hydration.
            <span
              key={line}
              className="hero-line block pb-1"
              style={{ animationDelay: `${1.2 + lineIndex * 0.15}s` }}
            >
              <span className={cn("inline-block", lineIndex === 1 && "text-gradient")}>{line}</span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.7 }}
          className="max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
        >
          Rise Websites creates high-converting websites that help businesses stand out, attract more customers, and generate more leads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.7 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <MagneticButton href="#pricing">
            Get Started
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton href="#why-us" variant="outline">
            <PlayCircle className="h-4 w-4" />
            Why Rise
          </MagneticButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </div>
          ))}
        </motion.div>

        <div className="w-full pt-4">
          <HeroQuoteForm />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted sm:flex"
      >
        Scroll
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
