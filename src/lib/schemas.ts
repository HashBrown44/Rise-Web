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

export const checkoutRequestSchema = z.object({
  plan: z.enum(["full-ownership", "growth-plan"]),
  email: z.string().trim().email().optional(),
  name: z.string().trim().min(1).optional(),
});

export type CheckoutRequestValues = z.infer<typeof checkoutRequestSchema>;
