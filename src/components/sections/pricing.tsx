"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, CreditCard } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { PricingParallaxBg } from "@/components/sections/pricing-parallax-bg";
import { PRICING_PLANS } from "@/lib/data/pricing";
import { cn } from "@/lib/utils";

export function Pricing() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current,
        { scale: 0.94 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.8,
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pricing" className="relative isolate px-4 py-28 sm:px-8">
      <PricingParallaxBg />

      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing. Real ownership."
          description="Choose the path that fits your business — a one-time build, or an ongoing growth partnership."
        />

        <div ref={gridRef} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {PRICING_PLANS.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 0.1}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: (typeof PRICING_PLANS)[number] }) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col gap-8 overflow-hidden rounded-3xl border p-8 sm:p-10",
        plan.featured
          ? "border-primary/40 bg-gradient-to-b from-surface to-surface-2 shadow-[0_0_80px_-20px_rgba(0,229,255,0.35)]"
          : "border-white/10 bg-surface/60",
      )}
    >
      {plan.featured && (
        <span className="absolute right-8 top-8 rounded-full bg-gradient-to-r from-primary to-highlight px-4 py-1 text-xs font-semibold text-background">
          Most Popular
        </span>
      )}

      <div>
        <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{plan.description}</p>
      </div>

      <div className="flex items-end gap-2">
        <span className="font-[family-name:var(--font-heading)] text-4xl font-semibold tracking-tight sm:text-5xl">
          {plan.price}
        </span>
        <span className="pb-1.5 text-sm text-muted">{plan.priceSuffix}</span>
      </div>

      <ul className="flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="h-3 w-3" />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3">
        <MagneticButton
          className="w-full justify-center"
          variant={plan.featured ? "primary" : "outline"}
          onClick={() => document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" })}
        >
          {plan.cta}
        </MagneticButton>

        <button
          onClick={() => setCheckoutOpen(true)}
          data-cursor-hover
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <CreditCard className="h-3.5 w-3.5" />
          Subscribe
        </button>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={plan.id}
        planLabel={plan.name}
        amountLabel={`${plan.price} ${plan.priceSuffix}`}
      />
    </div>
  );
}
