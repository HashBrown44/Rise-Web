"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { getStripeClient } from "@/lib/stripe-client";

type BannerState = { status: "checking" | "succeeded" | "processing" | "failed"; message?: string } | null;

export function PaymentReturnBanner() {
  const [banner, setBanner] = useState<BannerState>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get("payment_intent_client_secret");
    if (!clientSecret) return;

    getStripeClient().then(async (stripe) => {
      setBanner({ status: "checking" });
      if (!stripe) return;
      const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

      if (paymentIntent?.status === "succeeded") {
        setBanner({ status: "succeeded" });
      } else if (paymentIntent?.status === "processing") {
        setBanner({ status: "processing" });
      } else {
        setBanner({
          status: "failed",
          message: "Your payment wasn't completed. Please try again or contact us for help.",
        });
      }

      const url = new URL(window.location.href);
      ["payment_intent", "payment_intent_client_secret", "redirect_status"].forEach((key) =>
        url.searchParams.delete(key),
      );
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    });
  }, []);

  if (!banner) return null;

  const copy = {
    checking: { icon: Loader2, spin: true, title: "Confirming your payment…", tone: "border-white/10 bg-surface/90" },
    succeeded: {
      icon: CheckCircle2,
      spin: false,
      title: "Payment received — we'll be in touch within one business day.",
      tone: "border-primary/30 bg-primary/10",
    },
    processing: {
      icon: Loader2,
      spin: true,
      title: "Your payment is processing. We'll follow up once it clears.",
      tone: "border-white/10 bg-surface/90",
    },
    failed: {
      icon: AlertCircle,
      spin: false,
      title: banner.message ?? "Payment failed.",
      tone: "border-red-400/30 bg-red-400/10",
    },
  }[banner.status];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`glass fixed inset-x-4 top-24 z-[160] mx-auto flex max-w-md items-center gap-3 rounded-2xl border px-5 py-4 shadow-xl sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 ${copy.tone}`}
      >
        <copy.icon className={`h-5 w-5 shrink-0 text-primary ${copy.spin ? "animate-spin" : ""}`} />
        <p className="text-sm">{copy.title}</p>
        {banner.status !== "checking" && (
          <button
            onClick={() => setBanner(null)}
            aria-label="Dismiss"
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
