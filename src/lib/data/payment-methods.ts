import { CreditCard, Send, Wallet, type LucideIcon } from "lucide-react";

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
  {
    id: "paypal",
    stripeType: "paypal",
    label: "PayPal",
    description: "Pay from your PayPal balance",
    icon: Wallet,
    accent: "from-[#00457C]/25 to-[#0070BA]/25 text-[#4fb2ff]",
    subscriptionSupported: true,
  },
  {
    id: "venmo",
    stripeType: "venmo",
    label: "Venmo",
    description: "Pay with the Venmo app",
    icon: Send,
    accent: "from-[#0F4C93]/25 to-[#3D95CE]/25 text-[#7ec4f0]",
    subscriptionSupported: false,
  },
];
