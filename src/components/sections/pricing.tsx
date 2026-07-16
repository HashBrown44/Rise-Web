"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, Loader2, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CheckoutModal } from "@/components/checkout/checkout-modal";
import { PRICING_PLANS } from "@/lib/data/pricing";
import { startPaypalCheckout, type CheckoutProvider } from "@/lib/payments";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="relative isolate px-4 py-28 sm:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[160px]" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing. Real ownership."
          description="Choose the path that fits your business — a one-time build, or an ongoing growth partnership."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
  const [status, setStatus] = useState<"idle" | CheckoutProvider>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handlePaypalCheckout = async () => {
    setStatus("paypal");
    setNotice(null);
    try {
      await startPaypalCheckout(plan.id);
    } catch {
      setNotice("PayPal checkout is launching soon — use the form below to reserve your project today.");
    } finally {
      setStatus("idle");
    }
  };

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

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCheckoutOpen(true)}
            data-cursor-hover
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
          >
            <CreditCard className="h-3.5 w-3.5" />
            {plan.id === "full-ownership" ? "Pay with Stripe" : "Subscribe with Stripe"}
          </button>
          <button
            onClick={handlePaypalCheckout}
            disabled={status !== "idle"}
            data-cursor-hover
            className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-xs font-semibold text-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-60"
          >
            {status === "paypal" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
            {plan.id === "full-ownership" ? "Pay with PayPal" : "Subscribe with PayPal"}
          </button>
        </div>

        {notice && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-white/5 px-4 py-3 text-xs leading-relaxed text-highlight"
          >
            {notice}
          </motion.p>
        )}
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
