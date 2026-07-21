"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { ArrowLeft, CheckCircle2, ChevronRight, Loader2, Lock, X } from "lucide-react";
import { getStripeClient } from "@/lib/stripe-client";
import { FormField } from "@/components/ui/form-field";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { PAYMENT_METHODS, type PaymentMethodId } from "@/lib/data/payment-methods";
import { billingDetailsSchema, type BillingDetailsValues } from "@/lib/schemas";
import type { CheckoutPlan } from "@/lib/payments";
import { cn } from "@/lib/utils";

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

type Step = "billing" | "method" | "payment";

type CheckoutModalProps = {
  open: boolean;
  onClose: () => void;
  plan: CheckoutPlan;
  planLabel: string;
  amountLabel: string;
};

export function CheckoutModal({ open, onClose, plan, planLabel, amountLabel }: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("billing");
  const [billing, setBilling] = useState<BillingDetailsValues | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<PaymentMethodId | null>(null);
  const [ready, setReady] = useState(false);

  const handleClose = () => {
    onClose();
    setStep("billing");
    setBilling(null);
    setSelectedMethod(null);
    setClientSecret(null);
    setFetchError(null);
    setSubmittingMethod(null);
    setReady(false);
  };

  const availableMethods = PAYMENT_METHODS.filter(
    (m) => plan !== "growth-plan" || m.subscriptionSupported,
  );

  const handleSelectMethod = async (methodId: PaymentMethodId, billingOverride?: BillingDetailsValues) => {
    const billingValues = billingOverride ?? billing;
    if (!billingValues || submittingMethod) return;
    setSelectedMethod(methodId);
    setSubmittingMethod(methodId);
    setFetchError(null);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, method: methodId, billing: billingValues }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }
      setClientSecret(data.clientSecret);
      setStep("payment");
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setSubmittingMethod(null);
    }
  };

  const handleBillingSubmit = (values: BillingDetailsValues) => {
    setBilling(values);
    setFetchError(null);
    // Skip the method picker entirely when there's only one option to pick.
    if (availableMethods.length === 1) {
      handleSelectMethod(availableMethods[0].id, values);
    } else {
      setStep("method");
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

            <div className="mb-6 flex items-start gap-3">
              {step !== "billing" && (
                <button
                  onClick={() => {
                    setFetchError(null);
                    setStep(step === "payment" && availableMethods.length > 1 ? "method" : "billing");
                  }}
                  aria-label="Go back"
                  data-cursor-hover
                  className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-highlight">{planLabel}</p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold">{amountLabel}</h3>
              </div>
            </div>

            {step === "billing" && <BillingForm defaultValues={billing} onSubmit={handleBillingSubmit} />}

            {step === "method" && (
              <MethodPicker
                methods={availableMethods}
                selected={selectedMethod}
                submitting={submittingMethod}
                error={fetchError}
                onSelect={handleSelectMethod}
              />
            )}

            {step === "payment" && clientSecret && billing && (
              <Elements stripe={getStripeClient()} options={{ clientSecret, appearance: APPEARANCE }}>
                <PaymentForm billing={billing} onReady={() => setReady(true)} ready={ready} onClose={handleClose} />
              </Elements>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BillingForm({
  defaultValues,
  onSubmit,
}: {
  defaultValues: BillingDetailsValues | null;
  onSubmit: (values: BillingDetailsValues) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BillingDetailsValues>({
    resolver: zodResolver(billingDetailsSchema),
    defaultValues: defaultValues ?? {
      name: "",
      email: "",
      addressLine1: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <FormField label="Full Name" error={errors.name?.message} {...register("name")} />
      <FormField label="Email" type="email" error={errors.email?.message} {...register("email")} />
      <FormField label="Street Address" error={errors.addressLine1?.message} {...register("addressLine1")} />
      <div className="grid grid-cols-2 gap-4">
        <FormField label="City" error={errors.city?.message} {...register("city")} />
        <FormField label="State" error={errors.state?.message} {...register("state")} />
      </div>
      <FormField label="ZIP Code" error={errors.postalCode?.message} {...register("postalCode")} />

      <MagneticButton type="submit" className="mt-2 w-full justify-center">
        Continue to Payment Method
        <ChevronRight className="h-4 w-4" />
      </MagneticButton>
    </form>
  );
}

function MethodPicker({
  methods,
  selected,
  submitting,
  error,
  onSelect,
}: {
  methods: typeof PAYMENT_METHODS;
  selected: PaymentMethodId | null;
  submitting: PaymentMethodId | null;
  error: string | null;
  onSelect: (id: PaymentMethodId) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="mb-1 text-sm text-muted">How would you like to pay?</p>
      {methods.map((method) => {
        const isSubmitting = submitting === method.id;
        return (
          <button
            key={method.id}
            type="button"
            data-cursor-hover
            disabled={submitting !== null}
            onClick={() => onSelect(method.id)}
            className={cn(
              "flex items-center gap-4 rounded-2xl border px-4 py-4 text-left transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60",
              selected === method.id
                ? "border-primary/50 bg-primary/5"
                : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]",
            )}
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10",
                method.accent,
              )}
            >
              <method.icon className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{method.label}</span>
              <span className="block text-xs text-muted">{method.description}</span>
            </span>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            )}
          </button>
        );
      })}

      {error && (
        <p className="mt-1 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

function PaymentForm({
  billing,
  ready,
  onReady,
  onClose,
}: {
  billing: BillingDetailsValues;
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
        payment_method_data: {
          billing_details: {
            name: billing.name,
            email: billing.email,
            address: {
              line1: billing.addressLine1,
              city: billing.city,
              state: billing.state,
              postal_code: billing.postalCode,
              country: "US",
            },
          },
        },
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
      <PaymentElement
        onReady={onReady}
        options={{
          fields: { billingDetails: { name: "never", email: "never", address: "never" } },
          wallets: { link: "never" },
        }}
      />

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
