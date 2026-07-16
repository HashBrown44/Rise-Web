export type CheckoutPlan = "full-ownership" | "growth-plan";
export type CheckoutProvider = "stripe" | "paypal";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_PLAN_GROWTH_ID = process.env.NEXT_PUBLIC_PAYPAL_PLAN_GROWTH_ID;

// Wire this up to the PayPal JS SDK (one-time order) or Subscriptions API
// (using PAYPAL_PLAN_GROWTH_ID) for the Growth Plan.
export async function startPaypalCheckout(plan: CheckoutPlan): Promise<never> {
  if (!PAYPAL_CLIENT_ID || (plan === "growth-plan" && !PAYPAL_PLAN_GROWTH_ID)) {
    throw new Error("PayPal checkout is not configured yet.");
  }
  throw new Error("PayPal checkout is not yet connected.");
}
