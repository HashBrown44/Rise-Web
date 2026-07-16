"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { FormField } from "@/components/ui/form-field";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { HERO_LEAD_STORAGE_KEY } from "@/components/sections/hero-quote-form";
import { leadFormSchema, type LeadFormValues } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const PACKAGE_OPTIONS: { value: LeadFormValues["package"]; label: string }[] = [
  { value: "full-ownership", label: "Full Ownership — $599" },
  { value: "growth-plan", label: "Growth Plan — $400 + $50/mo" },
  { value: "not-sure", label: "Not Sure Yet" },
];

export function SignupForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      websiteUrl: "",
      package: "full-ownership",
      projectDescription: "",
    },
  });

  const selectedPackage = watch("package");

  useEffect(() => {
    const stored = sessionStorage.getItem(HERO_LEAD_STORAGE_KEY);
    if (!stored) return;
    try {
      const prefill = JSON.parse(stored) as { fullName?: string; email?: string; phone?: string };
      if (prefill.fullName) setValue("fullName", prefill.fullName);
      if (prefill.email) setValue("email", prefill.email);
      if (prefill.phone) setValue("phone", prefill.phone);
    } finally {
      sessionStorage.removeItem(HERO_LEAD_STORAGE_KEY);
    }
  }, [setValue]);

  const onSubmit = async (values: LeadFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="signup" className="relative px-4 pb-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12">
            <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-[100px]" />

            <SectionHeading
              eyebrow="Start Your Project"
              title="Tell us about your business."
              description="Fill this out and we'll follow up within one business day with next steps."
              align="left"
              className="mb-10"
            />

            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"
                  >
                    <CheckCircle2 className="h-9 w-9" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold">You&rsquo;re all set!</h3>
                  <p className="max-w-sm text-sm text-muted">
                    Thanks for reaching out. A member of our team will email you within one business day to kick off your project.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    Submit another request
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormField label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
                    <FormField label="Business Name" error={errors.businessName?.message} {...register("businessName")} />
                    <FormField label="Email Address" type="email" error={errors.email?.message} {...register("email")} />
                    <FormField label="Phone Number" type="tel" error={errors.phone?.message} {...register("phone")} />
                  </div>

                  <FormField
                    label="Website URL"
                    optional
                    error={errors.websiteUrl?.message}
                    {...register("websiteUrl")}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted">Package Selection</span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {PACKAGE_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          data-cursor-hover
                          onClick={() => setValue("package", option.value, { shouldValidate: true })}
                          className={cn(
                            "rounded-xl border px-4 py-3 text-left text-xs font-medium transition-colors duration-300",
                            selectedPackage === option.value
                              ? "border-primary/60 bg-primary/10 text-foreground"
                              : "border-white/10 text-muted hover:border-white/20",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <FormField
                    as="textarea"
                    label="Project Description"
                    error={errors.projectDescription?.message}
                    {...register("projectDescription")}
                  />

                  {status === "error" && (
                    <p className="text-xs text-red-400">
                      Something went wrong sending your request. Please try again or email us directly.
                    </p>
                  )}

                  <MagneticButton
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 w-full justify-center"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        Start My Project <Send className="h-4 w-4" />
                      </>
                    )}
                  </MagneticButton>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
