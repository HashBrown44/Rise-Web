"use client";

import { forwardRef, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type BaseProps = {
  label: string;
  error?: string;
  optional?: boolean;
};

type InputProps = BaseProps &
  React.InputHTMLAttributes<HTMLInputElement> & { as?: "input" };

type TextareaProps = BaseProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: "textarea" };

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps | TextareaProps>(
  function FormField(props, ref) {
    const { label, error, optional, className, as = "input", ...rest } = props;
    const id = useId();
    const [focused, setFocused] = useState(false);
    const hasValue = Boolean((rest as { value?: unknown }).value ?? (rest as { defaultValue?: unknown }).defaultValue);

    const sharedClasses = cn(
      "peer w-full rounded-xl border bg-white/[0.03] px-4 pb-2.5 pt-5 text-sm text-foreground outline-none transition-colors duration-300 placeholder:text-transparent",
      error
        ? "border-red-400/60 focus:border-red-400"
        : "border-white/10 focus:border-primary/60",
      className,
    );

    return (
      <div className="flex flex-col gap-1.5">
        <div className="relative isolate">
          {as === "textarea" ? (
            <textarea
              id={id}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={4}
              onFocus={(e) => {
                setFocused(true);
                (rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                (rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>).onBlur?.(e);
              }}
              placeholder={label}
              className={cn(sharedClasses, "resize-none")}
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={id}
              ref={ref as React.Ref<HTMLInputElement>}
              onFocus={(e) => {
                setFocused(true);
                (rest as React.InputHTMLAttributes<HTMLInputElement>).onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                (rest as React.InputHTMLAttributes<HTMLInputElement>).onBlur?.(e);
              }}
              placeholder={label}
              className={sharedClasses}
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          <label
            htmlFor={id}
            className={cn(
              "pointer-events-none absolute left-4 top-4 origin-left text-sm text-muted transition-all duration-200",
              "peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-sm",
              "peer-focus:top-2 peer-focus:scale-[0.8] peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:scale-[0.8]",
              (focused || hasValue) && "top-2 scale-[0.8]",
            )}
          >
            {label} {optional && <span className="text-muted/70">(optional)</span>}
          </label>

          <motion.span
            initial={false}
            animate={{ opacity: focused ? 1 : 0, scale: focused ? 1 : 0.98 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 -z-10 rounded-xl shadow-[0_0_0_3px_rgba(0,229,255,0.12)]"
          />
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 text-xs text-red-400"
            >
              <AlertCircle className="h-3 w-3" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
