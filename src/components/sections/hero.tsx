"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight, PlayCircle, ShieldCheck, Sparkles, Star } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ParticleField } from "@/components/ui/particle-field";
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

  const lightBackground = useMotionTemplate`radial-gradient(700px circle at ${smoothX}px ${smoothY}px, rgba(0,229,255,0.14), transparent 60%)`;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-screen items-center overflow-hidden pt-32 pb-24"
    >
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_55%)]" />
      <ParticleField density={70} />
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: lightBackground }}
      />

      <FloatingShapes />
      <CornerMockups />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-4 text-center sm:px-8">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-highlight"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Premium Web Design Agency
        </motion.span>

        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl">
          {HEADLINE_LINES.map((line, lineIndex) => (
            <span key={line} className="block overflow-hidden pb-1">
              <motion.span
                className={cn("inline-block", lineIndex === 1 && "text-gradient")}
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  delay: 2.0 + lineIndex * 0.15,
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.7 }}
          className="max-w-xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
        >
          Rise Websites creates high-converting websites that help businesses stand out, attract more customers, and generate more leads.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.7, duration: 0.7 }}
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
          transition={{ delay: 3, duration: 0.8 }}
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
        transition={{ delay: 3.2, duration: 1 }}
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

function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden>
      <motion.div
        className="absolute left-[6%] top-[16%] h-24 w-24 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm"
        style={{ rotate: 12 }}
        animate={{ y: [0, -24, 0], rotate: [12, 22, 12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[14%] h-16 w-16 rounded-full border border-secondary/40 bg-secondary/10"
        animate={{ y: [0, 26, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute right-[10%] bottom-[20%] h-20 w-20 rotate-45 rounded-xl border border-highlight/30 bg-highlight/5"
        animate={{ y: [0, -18, 0], rotate: [45, 60, 45] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute left-[10%] bottom-[16%] h-14 w-14 rounded-full border border-primary/30 bg-primary/5"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      />
    </div>
  );
}

function CornerMockups() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden xl:block" aria-hidden>
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-[4%] top-[22%]"
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="glass flex items-center gap-3 rounded-2xl border border-white/10 p-4 shadow-xl"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-highlight to-primary text-background">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">+284% Leads</p>
            <p className="text-xs text-muted">in 90 days</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-[4%] top-[24%]"
      >
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="glass rounded-2xl border border-white/10 px-5 py-3 shadow-xl"
        >
          <p className="text-xs text-muted">Site Speed</p>
          <p className="text-lg font-semibold text-primary">98/100</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.6, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-[8%] left-[8%]"
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="glass rounded-2xl border border-white/10 px-5 py-3 shadow-xl"
        >
          <p className="text-xs text-muted">Launch Time</p>
          <p className="text-lg font-semibold text-highlight">2–4 Weeks</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
