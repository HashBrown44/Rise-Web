"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/data/testimonials";

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((next: number) => {
    setDirection(next > index || (index === TESTIMONIALS.length - 1 && next === 0) ? 1 : -1);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, [index]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const testimonial = TESTIMONIALS[index];

  return (
    <section className="relative px-4 py-28 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <SectionHeading
          eyebrow="Client Success"
          title="Don't just take our word for it."
          description="Business owners who traded an outdated website for one that actually works."
        />

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="glass relative min-h-[320px] overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12">
            <Quote className="absolute right-8 top-8 h-16 w-16 text-primary/10" />
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-highlight text-highlight" />
                  ))}
                </div>
                <p className="text-balance text-xl leading-relaxed text-foreground sm:text-2xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-semibold text-background">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button
              onClick={() => goTo(index - 1)}
              data-cursor-hover
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => goTo(i)}
                  data-cursor-hover
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="relative h-2 w-8 overflow-hidden rounded-full bg-white/10"
                >
                  {i === index && (
                    <motion.span
                      layoutId="testimonial-active"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-highlight"
                    />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => goTo(index + 1)}
              data-cursor-hover
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
