import { CreditCard, type LucideIcon } from "lucide-react";

export type PaymentMethodId = "card" | "paypal" | "venmo";

export type PaymentMethodOption = {
  id: PaymentMethodId;
  /** Stripe's payment_method_types string for this option. */
  stripeType: string;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  /** Venmo (and some wallets) can't be used on recurring/subscription invoices. */
  subscriptionSupported: boolean;
};

// PayPal and Venmo are built out (see checkout-modal.tsx / api/checkout/stripe)
// but disabled here until Stripe grants those capabilities on the live account.
export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "card",
    stripeType: "card",
    label: "Card",
    description: "Credit or debit",
    icon: CreditCard,
    accent: "from-primary/20 to-secondary/20 text-primary",
    subscriptionSupported: true,
  },
];
