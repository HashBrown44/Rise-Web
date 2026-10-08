// The "pure" entry only injects Stripe.js when loadStripe() is first called
// (opening checkout or returning from payment), not on every page view.
import type { Stripe } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js/pure";

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripeClient() {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise;
}
