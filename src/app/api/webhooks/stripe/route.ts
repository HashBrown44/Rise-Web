import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const payload = await request.text();

  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      // TODO: mark the "Full Ownership" order as paid — e.g. notify the team,
      // create a project record in the CRM, send the client a receipt/welcome email.
      console.log("[webhook] payment succeeded", paymentIntent.id, paymentIntent.metadata);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object;
      // TODO: mark the "Growth Plan" subscription's invoice as paid — first invoice
      // covers the $400 setup fee + first month; later ones are the $50/mo charge.
      const subscriptionId = invoice.parent?.subscription_details?.subscription;
      console.log("[webhook] invoice paid", invoice.id, subscriptionId);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // TODO: notify the client their card was declined and prompt them to update it.
      console.log("[webhook] invoice payment failed", invoice.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
