"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { FormField } from "@/components/ui/form-field";
import { MagneticButton } from "@/components/ui/magnetic-button";

export const HERO_LEAD_STORAGE_KEY = "rise-lead-prefill";

type FieldErrors = Partial<Record<"fullName" | "email" | "phone", string>>;

export function HeroQuoteForm() {
  const [values, setValues] = useState({ fullName: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: FieldErrors = {};
    if (values.fullName.trim().length < 2) nextErrors.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) nextErrors.email = "Enter a valid email";
    if (values.phone.trim().length < 7) nextErrors.phone = "Enter a valid phone number";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    sessionStorage.setItem(HERO_LEAD_STORAGE_KEY, JSON.stringify(values));
    document.getElementById("signup")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={handleSubmit}
      noValidate
      className="glass mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-white/10 p-5 sm:flex-row sm:items-start sm:gap-3 sm:p-3"
    >
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <FormField
          label="Full Name"
          value={values.fullName}
          error={errors.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
        />
        <FormField
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
        />
        <FormField
          label="Phone"
          type="tel"
          value={values.phone}
          error={errors.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
        />
      </div>
      <MagneticButton type="submit" className="shrink-0 justify-center whitespace-nowrap sm:mt-0">
        Get My Free Quote <ArrowRight className="h-4 w-4" />
      </MagneticButton>
    </motion.form>
  );
}
