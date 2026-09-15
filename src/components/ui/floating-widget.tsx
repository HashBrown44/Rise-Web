"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function FloatingWidget() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass fixed bottom-4 right-4 z-40 hidden w-80 rounded-2xl border border-white/10 p-5 shadow-2xl sm:block"
        >
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            data-cursor-hover
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <span className="label-mono text-[11px] font-semibold text-highlight">Free, No Pressure</span>
          <h4 className="mt-2 font-[family-name:var(--font-heading)] text-lg font-semibold leading-snug">
            Ready to grow your business?
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tell us about your project and we&apos;ll get back to you within one business day.
          </p>
          <MagneticButton
            href="#signup"
            className="mt-4 w-full justify-center px-5 py-3 text-xs"
          >
            Get Started
            <ArrowUpRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
