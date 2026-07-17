"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE } from "@/lib/data/site";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "flex w-full max-w-6xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500",
          scrolled
            ? "glass border-white/10 shadow-[0_8px_40px_-15px_rgba(0,229,255,0.25)]"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#top" data-cursor-hover className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-semibold">
          <Image src="/rise-logo-mark.png" alt="" width={700} height={435} priority className="h-8 w-auto" />
          {SITE.shortName}
          <span className="text-primary">.</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticButton href="#pricing" className="px-5 py-2.5 text-xs">
            Get Started
            <ArrowUpRight className="h-3.5 w-3.5" />
          </MagneticButton>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          data-cursor-hover
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass absolute inset-x-4 top-24 z-40 flex flex-col gap-1 rounded-3xl border border-white/10 p-4 md:hidden"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl px-4 py-3 text-base font-medium text-muted transition-colors hover:bg-white/5 hover:text-foreground"
              >
                {link.label}
              </motion.a>
            ))}
            <a
              href="#pricing"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-gradient-to-r from-primary to-highlight px-4 py-3 text-center text-base font-semibold text-background"
            >
              Get Started
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
