"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden px-4 py-32 sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-gradient-shift absolute inset-0 bg-[linear-gradient(120deg,rgba(0,229,255,0.12),rgba(124,58,237,0.14),rgba(34,211,238,0.1))] bg-[length:200%_200%]" />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px]" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <Reveal>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            Ready To <span className="text-gradient">Elevate</span> Your Online Presence?
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xl text-balance text-lg text-muted sm:text-xl">
            Let&rsquo;s build a website that helps your business grow.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <MagneticButton href="#signup" className="px-10 py-5 text-base">
            Book Your Free Consultation
            <ArrowUpRight className="h-5 w-5" />
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}
