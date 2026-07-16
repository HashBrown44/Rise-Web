import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeClient) return stripeClient;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to .env.local to enable checkout.");
  }

  stripeClient = new Stripe(secretKey, { apiVersion: "2026-06-24.dahlia" });
  return stripeClient;
}
