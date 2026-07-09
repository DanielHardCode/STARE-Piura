/**
 * @file src/animations/useGridCanvas.ts
 * @description Hook React para canvas de cuadrícula de puntos reactiva al cursor.
 * Cada punto del grid se desplaza suavemente alejándose del cursor (efecto ripple/displacement).
 * Sutil y decorativo, ideal para fondos estáticos.
 * Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';

interface GridOptions {
  gap?: number;           // Separación entre puntos del grid
  dotRadius?: number;     // Radio base de cada punto
  color?: string;         // Color RGB "r,g,b"
  opacity?: number;       // Opacidad base
  repelDist?: number;     // Distancia de repulsión del cursor
  repelStrength?: number; // Intensidad de la repulsión
}

export function useGridCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: GridOptions = {}
) {
  const {
    gap           = 32,
    dotRadius     = 1.4,
    color         = '45,212,191',  // teal-400
    opacity       = 0.25,
    repelDist     = 80,
    repelStrength = 18,
  } = options;

  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    canvas.parentElement?.addEventListener('mousemove', handleMouse);
    canvas.parentElement?.addEventListener('mouseleave', handleLeave);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.012;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const cols = Math.ceil(canvas.width  / gap) + 1;
      const rows = Math.ceil(canvas.height / gap) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const bx = c * gap;
          const by = r * gap;

          // Subtle organic wave displacement
          const wave = Math.sin(bx * 0.04 + time) * Math.cos(by * 0.04 + time * 0.7) * 2.5;

          // Mouse repulsion
          const dx   = bx - mx;
          const dy   = by - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let rx = 0, ry = 0;
          if (dist < repelDist && dist > 0) {
            const strength = (1 - dist / repelDist) * repelStrength;
            rx = (dx / dist) * strength;
            ry = (dy / dist) * strength;
          }

          const x = bx + rx + wave * 0.5;
          const y = by + ry + wave * 0.5;

          // Size pulse near cursor
          const proximity = dist < repelDist ? (1 - dist / repelDist) : 0;
          const r2 = dotRadius + proximity * 1.6;

          // Opacity pulse with wave
          const o = opacity + Math.abs(wave) * 0.04 + proximity * 0.2;

          ctx.beginPath();
          ctx.arc(x, y, r2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${Math.min(o, 0.6)})`;
          ctx.fill();
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
  }, [gap, dotRadius, color, opacity, repelDist, repelStrength]);
}
