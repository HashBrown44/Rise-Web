"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotSpring = useSpring(x, { damping: 40, stiffness: 900 });
  const dotSpringY = useSpring(y, { damping: 40, stiffness: 900 });
  const ringSpring = useSpring(x, { damping: 28, stiffness: 220 });
  const ringSpringY = useSpring(y, { damping: 28, stiffness: 220 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setIsVisible(true);
      const target = e.target as HTMLElement;
      setIsPointer(Boolean(target.closest("a, button, [data-cursor-hover]")));
    };
    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [x, y]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
      style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.3s ease" }}
      aria-hidden
    >
      <motion.div
        className="absolute rounded-full bg-primary"
        style={{
          left: dotSpring,
          top: dotSpringY,
          width: 8,
          height: 8,
          x: "-50%",
          y: "-50%",
        }}
      />
      <motion.div
        className="absolute rounded-full border border-primary/60"
        animate={{
          width: isPointer ? 64 : 36,
          height: isPointer ? 64 : 36,
          opacity: isPointer ? 0.9 : 0.5,
          backgroundColor: isPointer ? "rgba(0,229,255,0.08)" : "rgba(0,229,255,0)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        style={{
          left: ringSpring,
          top: ringSpringY,
          x: "-50%",
          y: "-50%",
        }}
      />
    </div>
  );
}
