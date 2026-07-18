import { z } from "zod";

export const leadFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  businessName: z.string().trim().min(2, "Enter your business name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .regex(/^[0-9()+\-.\s]+$/, "Use only numbers and phone symbols"),
  websiteUrl: z
    .string()
    .trim()
    .url("Enter a valid URL (include https://)")
    .optional()
    .or(z.literal("")),
  package: z.enum(["full-ownership", "growth-plan", "not-sure"], {
    message: "Select a package",
  }),
  projectDescription: z.string().trim().min(10, "Tell us a bit more about your project"),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const billingDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  addressLine1: z.string().trim().min(3, "Enter your street address"),
  city: z.string().trim().min(1, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  postalCode: z.string().trim().min(3, "Enter your ZIP code"),
});

export type BillingDetailsValues = z.infer<typeof billingDetailsSchema>;

export const checkoutRequestSchema = z.object({
  plan: z.enum(["full-ownership", "growth-plan"]),
  method: z.enum(["card", "paypal", "venmo"]),
  billing: billingDetailsSchema,
});

export type CheckoutRequestValues = z.infer<typeof checkoutRequestSchema>;
