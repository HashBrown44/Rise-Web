"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number;
  depth: number; // 0 = far/small, 1 = near/large — drives parallax + glow
  warm: boolean;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
};

const WHITE = "247, 248, 255";
const AMBER = "232, 179, 122";

export function StarField({ density = 140 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let shootingStars: ShootingStar[] = [];
    let animationId = 0;
    let t = 0;
    let nextShootingStarAt = 8 + Math.random() * 14;

    const resize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      const count = Math.min(density, Math.floor((width * height) / 6500));
      stars = Array.from({ length: count }, () => {
        // Bias heavily toward small/dim stars — a realistic sky has far more
        // faint points than bright ones. depth^2.4 skews the distribution down.
        const depth = Math.random() ** 2.4;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.5 + depth * 1.6,
          baseAlpha: 0.25 + depth * 0.6,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.4 + Math.random() * 1.1,
          depth,
          warm: Math.random() < 0.15,
        };
      });
    };

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.7;
      const startY = Math.random() * height * 0.3;
      const angle = (Math.PI / 5) + Math.random() * (Math.PI / 10);
      const speed = 9 + Math.random() * 5;
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 22 + Math.random() * 10,
      });
    };

    const step = () => {
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      const mouse = smoothMouseRef.current;
      mouse.x += (mouseRef.current.x - mouse.x) * 0.03;
      mouse.y += (mouseRef.current.y - mouse.y) * 0.03;
      const parallaxX = (mouse.x - width / 2) / width;
      const parallaxY = (mouse.y - height / 2) / height;

      for (const s of stars) {
        const flicker = 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const alpha = s.baseAlpha * flicker;
        const px = s.x - parallaxX * 14 * s.depth;
        const py = s.y - parallaxY * 14 * s.depth;
        const color = s.warm ? AMBER : WHITE;

        if (s.depth > 0.7) {
          // Soft glow halo for the brighter, "closer" stars only.
          const glow = ctx.createRadialGradient(px, py, 0, px, py, s.r * 5);
          glow.addColorStop(0, `rgba(${color}, ${alpha * 0.35})`);
          glow.addColorStop(1, `rgba(${color}, 0)`);
          ctx.fillStyle = glow;
          ctx.fillRect(px - s.r * 5, py - s.r * 5, s.r * 10, s.r * 10);
        }

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.fill();
      }

      if (!prefersReduced) {
        if (t > nextShootingStarAt) {
          spawnShootingStar();
          nextShootingStarAt = t + 10 + Math.random() * 16;
        }

        shootingStars = shootingStars.filter((s) => s.life < s.maxLife);
        for (const s of shootingStars) {
          s.life += 1;
          s.x += s.vx;
          s.y += s.vy;
          const progress = s.life / s.maxLife;
          const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
          const tailX = s.x - s.vx * 4;
          const tailY = s.y - s.vy * 4;
          const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${WHITE}, ${0.85 * fade})`);
          grad.addColorStop(1, `rgba(${WHITE}, 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(step);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    resize();
    init();
    mouseRef.current = { x: width / 2, y: height / 2 };
    smoothMouseRef.current = { x: width / 2, y: height / 2 };
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    if (!prefersReduced) {
      animationId = requestAnimationFrame(step);
    } else {
      step();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />;
}
