"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "outline" | "ghost";
  disabled?: boolean;
};

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  type = "button",
  variant = "primary",
  disabled,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: relX * 0.35, y: relY * 0.45 });
  };

  const handleLeave = () => setPos({ x: 0, y: 0 });

  const styles = {
    primary:
      "bg-gradient-to-r from-primary to-highlight text-background shadow-[0_0_30px_-5px_rgba(0,229,255,0.6)] hover:shadow-[0_0_45px_-5px_rgba(0,229,255,0.85)]",
    outline: "border border-white/15 text-foreground hover:border-primary/60 hover:bg-white/5",
    ghost: "text-foreground hover:text-primary",
  } as const;

  const Component = (href ? motion.a : motion.button) as React.ElementType;

  return (
    <Component
      ref={ref}
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.4 }}
      data-cursor-hover
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-50",
        styles[variant],
        className,
      )}
    >
      {children}
    </Component>
  );
}
