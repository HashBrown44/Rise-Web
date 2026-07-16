"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { CheckCircle2, Loader2, Lock, X } from "lucide-react";
import { getStripeClient } from "@/lib/stripe-client";
import { FormField } from "@/components/ui/form-field";
import { MagneticButton } from "@/components/ui/magnetic-button";
import type { CheckoutPlan } from "@/lib/payments";

const APPEARANCE: StripeElementsOptions["appearance"] = {
  theme: "night",
  variables: {
    colorPrimary: "#00e5ff",
    colorBackground: "#0b1220",
    colorText: "#ffffff",
    colorTextSecondary: "#94a3b8",
    colorDanger: "#f87171",
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(148, 163, 184, 0.18)",
      backgroundColor: "rgba(255, 255, 255, 0.03)",
    },
    ".Input:focus": {
      border: "1px solid rgba(0, 229, 255, 0.6)",
      boxShadow: "0 0 0 1px rgba(0, 229, 255, 0.3)",
    },
    ".Label": {
      color: "#94a3b8",
    },
  },
};

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  plan: CheckoutPlan;
  planLabel: string;
  amountLabel: string;
};

export function CheckoutModal({ open, onClose, plan, planLabel, amountLabel }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [contact, setContact] = useState({ name: "", email: "" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    onClose();
    setClientSecret(null);
    setFetchError(null);
    setReady(false);
  };

  const handleStartCheckout = async () => {
    setFetchError(null);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email: contact.email || undefined, name: contact.name || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }
      setClientSecret(data.clientSecret);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unable to start checkout.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-white/10 p-6 sm:p-8"
          >
            <button
              onClick={handleClose}
              aria-label="Close checkout"
              data-cursor-hover
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">{planLabel}</p>
              <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold">{amountLabel}</h3>
            </div>

            {!clientSecret && !fetchError && (
              <div className="flex flex-col gap-4">
                <FormField
                  label="Full Name"
                  value={contact.name}
                  onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                />
                <FormField
                  label="Email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                />
                <MagneticButton
                  className="w-full justify-center"
                  disabled={!contact.name || !contact.email}
                  onClick={handleStartCheckout}
                >
                  Continue to Payment
                </MagneticButton>
              </div>
            )}

            {fetchError && (
              <div className="flex flex-col gap-4">
                <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {fetchError}
                </p>
                <MagneticButton variant="outline" className="w-full justify-center" onClick={handleStartCheckout}>
                  Try Again
                </MagneticButton>
              </div>
            )}

            {clientSecret && (
              <Elements
                stripe={getStripeClient()}
                options={{ clientSecret, appearance: APPEARANCE }}
              >
                <PaymentForm
                  onReady={() => setReady(true)}
                  ready={ready}
                  onClose={handleClose}
                />
              </Elements>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaymentForm({
  ready,
  onReady,
  onClose,
}: {
  ready: boolean;
  onReady: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: typeof window !== "undefined" ? window.location.href : undefined,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed. Please check your details and try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded" || paymentIntent?.status === "processing") {
      setSucceeded(true);
    }
    setSubmitting(false);
  };

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <div>
          <h4 className="text-lg font-semibold">Payment received</h4>
          <p className="mt-1 text-sm text-muted">
            We&apos;ll be in touch within one business day to kick off your project.
          </p>
        </div>
        <MagneticButton onClick={onClose} className="mt-2">
          Done
        </MagneticButton>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement onReady={onReady} />

      {ready && (
        <p className="flex items-center gap-2 text-xs text-muted">
          <Lock className="h-3.5 w-3.5 shrink-0" />
          On iPhone or Android, tap the card number field — your browser can scan your card with the camera instead of typing it.
        </p>
      )}

      {error && (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>
      )}

      <MagneticButton type="submit" className="w-full justify-center" disabled={!stripe || submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {submitting ? "Processing…" : "Pay Securely"}
      </MagneticButton>
    </form>
  );
}
