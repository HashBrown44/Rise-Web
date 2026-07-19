import type { CheckoutPlan } from "@/lib/payments";

export type PricingPlan = {
  id: CheckoutPlan;
  name: string;
  price: string;
  priceSuffix: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "full-ownership",
    name: "Full Ownership",
    price: "$799",
    priceSuffix: "one-time",
    description: "Pay once, own it forever. Perfect for businesses that want a great site with zero ongoing fees.",
    features: [
      "Custom Website",
      "Mobile Responsive Design",
      "SEO Foundation",
      "Contact Form",
      "Full Ownership",
      "No Monthly Fees",
    ],
    cta: "Purchase & Get Started",
  },
  {
    id: "growth-plan",
    name: "Growth Plan",
    price: "$399 + $99.99",
    priceSuffix: "one-time + /month",
    description: "For businesses that want their site actively maintained, updated, and improved every month.",
    features: [
      "Custom Website",
      "Full Ownership",
      "Monthly Updates",
      "Content Changes",
      "Ongoing Support",
      "Priority Assistance",
    ],
    cta: "Choose Growth Plan",
    featured: true,
  },
];
