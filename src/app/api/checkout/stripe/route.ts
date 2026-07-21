import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { checkoutRequestSchema } from "@/lib/schemas";
import { PAYMENT_METHODS } from "@/lib/data/payment-methods";

const AMOUNTS = {
  "full-ownership": 100, // $1.00 one-time
  "growth-setup": 39900, // $399.00 one-time
  "growth-monthly": 4999, // $49.99 / month
} as const;

let growthSetupProductId: string | null = null;
let growthMonthlyProductId: string | null = null;

async function getOrCreateProduct(stripe: Stripe, kind: "setup" | "monthly"): Promise<string> {
  if (kind === "setup" && growthSetupProductId) return growthSetupProductId;
  if (kind === "monthly" && growthMonthlyProductId) return growthMonthlyProductId;

  const name =
    kind === "setup" ? "Rise Websites — Growth Plan Setup" : "Rise Websites — Growth Plan Maintenance";
  const product = await stripe.products.create({ name });

  if (kind === "setup") growthSetupProductId = product.id;
  else growthMonthlyProductId = product.id;

  return product.id;
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
