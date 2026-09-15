"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });
  const sheenX = useSpring(mouseX, { stiffness: 120, damping: 24 });
  const sheenY = useSpring(mouseY, { stiffness: 120, damping: 24 });

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    mouseX.set(relX);
    mouseY.set(relY);
    rotateY.set(((relX - rect.width / 2) / (rect.width / 2)) * maxTilt);
    rotateX.set(-((relY - rect.height / 2) / (rect.height / 2)) * maxTilt);
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    mouseX.set(-9999);
    mouseY.set(-9999);
  };

  const sheen = useMotionTemplate`radial-gradient(320px circle at ${sheenX}px ${sheenY}px, rgba(199,205,209,0.14), transparent 60%)`;

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        className={cn("relative h-full")}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          style={{ background: sheen }}
        />
        {children}
      </motion.div>
    </div>
  );
}
