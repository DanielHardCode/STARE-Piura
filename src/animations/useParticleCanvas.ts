/**
 * @file src/animations/useParticleCanvas.ts
 * @description Hook React para canvas de partículas conectadas.
 * Dibuja nodos flotantes que se conectan con líneas cuando están cerca.
 * Reactivo al cursor del mouse (las partículas se atraen suavemente).
 * Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';

interface ParticleOptions {
  count?: number;
  color?: string;        // Color base en formato RGB "r,g,b"
  accentColor?: string;  // Color acento RGB "r,g,b"
  maxDist?: number;      // Distancia máxima para conectar
  speed?: number;        // Velocidad base de partículas
  radius?: number;       // Radio de cada partícula
  opacity?: number;      // Opacidad global
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

export function useParticleCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: ParticleOptions = {}
) {
  const {
    count       = 55,
    color       = '45,212,191',   // teal-400
    accentColor = '251,191,36',   // amber-400
    maxDist     = 120,
    speed       = 0.4,
    radius      = 2.2,
    opacity     = 0.7,
  } = options;

  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();

    const init = () => {
      particles.current = Array.from({ length: count }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        vx:      (Math.random() - 0.5) * speed * 2,
        vy:      (Math.random() - 0.5) * speed * 2,
        radius:  radius * (0.6 + Math.random() * 0.8),
        opacity: 0.4 + Math.random() * 0.6,
      }));
    };
    init();

    const ro = new ResizeObserver(() => { resize(); init(); });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.parentElement?.addEventListener('mousemove', handleMouse);
    canvas.parentElement?.addEventListener('mouseleave', handleLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ps = particles.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        // Gentle mouse attraction
        const dx   = mx - p.x;
        const dy   = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00015;
          p.vy += dy * 0.00015;
        }

        // Dampen + clamp
        p.vx *= 0.995;
        p.vy *= 0.995;
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > speed * 1.6) {
          p.vx = (p.vx / spd) * speed * 1.6;
          p.vy = (p.vy / spd) * speed * 1.6;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0)             { p.x = 0;            p.vx *= -1; }
        if (p.x > canvas.width)  { p.x = canvas.width; p.vx *= -1; }
        if (p.y < 0)             { p.y = 0;            p.vy *= -1; }
        if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -1; }

        const isAccent = i % 7 === 0;
        const c = isAccent ? accentColor : color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${p.opacity * opacity})`;
        ctx.fill();

        for (let j = i + 1; j < ps.length; j++) {
          const q   = ps[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const d   = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < maxDist) {
            const alpha = (1 - d / maxDist) * 0.35 * opacity;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
      canvas.parentElement?.removeEventListener('mousemove', handleMouse);
      canvas.parentElement?.removeEventListener('mouseleave', handleLeave);
    };
  }, [count, color, accentColor, maxDist, speed, radius, opacity]);
}
