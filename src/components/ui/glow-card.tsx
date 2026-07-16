"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
};

export function GlowCard({ children, className, tilt = true }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mouseX, (v) => `${v * 100}%`);
  const glowY = useTransform(mouseY, (v) => `${v * 100}%`);
  const background = useMotionTemplate`radial-gradient(340px circle at ${glowX} ${glowY}, rgba(0,229,255,0.14), transparent 70%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px);
    mouseY.set(py);
    if (tilt) {
      rotateY.set((px - 0.5) * 14);
      rotateX.set((0.5 - py) * 14);
    }
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/60 p-8 transition-[border-color,box-shadow] duration-300 hover:border-primary/40 hover:shadow-[0_0_60px_-20px_rgba(0,229,255,0.45)]",
        className,
      )}
    >
      <motion.div
        style={{ background }}
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div style={{ transform: "translateZ(30px)" }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}
