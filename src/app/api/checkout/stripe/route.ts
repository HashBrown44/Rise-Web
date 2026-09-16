import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/schemas";
import { PAYMENT_METHODS } from "@/lib/data/payment-methods";

const AMOUNTS = {
  "full-ownership": 79900, // $799.00 one-time
  "growth-setup": 50000, // $500.00 charged at checkout
  "growth-monthly": 10000, // $100.00 / month, starting one month after checkout
} as const;

// Fixed, deterministic product IDs — NOT looked up or cached in memory. An
// in-memory cache only works for the lifetime of one warm server process; on
// Vercel's serverless functions each invocation can be a fresh cold start
// with no shared memory, so a memory-only cache would create a brand new
// duplicate Stripe Product on every single Growth Plan checkout in
// production. A fixed ID is idempotent across restarts, cold starts, and
// concurrent requests, with no lookup call needed on the common path.
const GROWTH_PRODUCT_IDS = {
  setup: "rise-web-growth-setup",
  monthly: "rise-web-growth-monthly",
} as const;

/** Same day next month, clamped to that month's last valid day (e.g. Jan 31 -> Feb 28/29,
 * never rolling into March like naive Date math would). Stripe then anchors every
 * subsequent monthly cycle to this same day-of-month on its own. */
function nextMonthAnchor(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInNextMonth = new Date(year, month + 2, 0).getDate();
  const targetDay = Math.min(now.getDate(), daysInNextMonth);
  const anchor = new Date(year, month + 1, targetDay, now.getHours(), now.getMinutes(), now.getSeconds());
  return Math.floor(anchor.getTime() / 1000);
}

function isStripeErrorCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === code;
}

async function getOrCreateProduct(stripe: Stripe, kind: "setup" | "monthly"): Promise<string> {
  const id = GROWTH_PRODUCT_IDS[kind];

  try {
    await stripe.products.retrieve(id);
    return id;
  } catch (error) {
    if (!isStripeErrorCode(error, "resource_missing")) throw error;
  }

  const name =
    kind === "setup" ? "Rise Websites — Growth Plan Setup" : "Rise Websites — Growth Plan Maintenance";
  try {
    await stripe.products.create({ id, name });
  } catch (error) {
    // A concurrent request may have created it a moment ago — that's fine.
    if (!isStripeErrorCode(error, "resource_already_exists")) throw error;
  }
  return id;
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = checkoutRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ ok: false, errors: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { plan, method, billing } = result.data;

  const methodOption = PAYMENT_METHODS.find((m) => m.id === method);
  if (!methodOption) {
    return NextResponse.json({ ok: false, error: "Unsupported payment method." }, { status: 400 });
  }
  if (plan === "growth-plan" && !methodOption.subscriptionSupported) {
    return NextResponse.json(
      { ok: false, error: `${methodOption.label} isn't available for subscription plans. Choose Card or PayPal.` },
      { status: 400 },
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your environment." },
      { status: 503 },
    );
  }

  const address = {
    line1: billing.addressLine1,
    city: billing.city,
    state: billing.state,
    postal_code: billing.postalCode,
    country: "US",
  };

  try {
    if (plan === "full-ownership") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: AMOUNTS["full-ownership"],
        currency: "usd",
        receipt_email: billing.email,
        payment_method_types: [methodOption.stripeType],
        shipping: { name: billing.name, address },
        metadata: { plan, customerName: billing.name },
      });

      return NextResponse.json({ ok: true, clientSecret: paymentIntent.client_secret });
    }

    const [setupProduct, monthlyProduct] = await Promise.all([
      getOrCreateProduct(stripe, "setup"),
      getOrCreateProduct(stripe, "monthly"),
    ]);

    const customer = await stripe.customers.create({
      email: billing.email,
      name: billing.name,
      address,
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: "usd",
            product: monthlyProduct,
            unit_amount: AMOUNTS["growth-monthly"],
            recurring: { interval: "month" },
          },
        },
      ],
      add_invoice_items: [
        {
          price_data: {
            currency: "usd",
            product: setupProduct,
            unit_amount: AMOUNTS["growth-setup"],
          },
        },
      ],
      // A one-month trial suppresses the recurring item's charge until the
      // trial ends, but one-time add_invoice_items still get invoiced right
      // now — so today's invoice (generated below) is just the $500 setup
      // fee, and the $100/mo recurring charge starts automatically in
      // exactly one month, off-session, using the saved payment method.
      trial_end: nextMonthAnchor(),
      payment_behavior: "default_incomplete",
      payment_settings: {
        save_default_payment_method: "on_subscription",
        payment_method_types: [methodOption.stripeType as Stripe.SubscriptionCreateParams.PaymentSettings.PaymentMethodType],
      },
      expand: ["latest_invoice.confirmation_secret"],
      metadata: { plan },
    });

    const invoice = subscription.latest_invoice;
    const clientSecret =
      typeof invoice === "object" && invoice?.confirmation_secret ? invoice.confirmation_secret.client_secret : null;

    if (!clientSecret) {
      return NextResponse.json({ ok: false, error: "Unable to start subscription checkout." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, clientSecret, subscriptionId: subscription.id });
  } catch (error) {
    console.error("[checkout] stripe error", error);
    return NextResponse.json({ ok: false, error: "Something went wrong starting checkout." }, { status: 500 });
  }
}
