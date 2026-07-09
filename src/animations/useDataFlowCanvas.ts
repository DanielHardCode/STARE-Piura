/**
 * @file src/animations/useDataFlowCanvas.ts
 * @description Hook React para canvas de flujo de datos "terminal".
 * Dibuja líneas / streams de datos que ascienden con glow, simulando
 * actividad de red o tráfico de información. Decorativo.
 * Respeta prefers-reduced-motion.
 */

import { useEffect, useRef } from 'react';

interface DataFlowOptions {
  streamCount?: number;  // Número de streams simultáneos
  color?: string;        // Color principal RGB "r,g,b"
  accentColor?: string;  // Color secundario RGB
  speed?: number;        // Velocidad de ascenso
  opacity?: number;      // Opacidad máxima de los streams
}

interface Stream {
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
  width: number;
  isAccent: boolean;
  char?: string;
  charTimer: number;
  charInterval: number;
  chars: string[];
}

const DATA_CHARS = ['0', '1', 'S', '/', '.', 'T', 'X', '►', '●', '◆', '%'];

function randomChar(): string {
  return DATA_CHARS[Math.floor(Math.random() * DATA_CHARS.length)];
}

export function useDataFlowCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options: DataFlowOptions = {}
) {
  const {
    streamCount = 18,
    color       = '45,212,191',   // teal-400
    accentColor = '251,191,36',   // amber-400
    speed       = 0.8,
    opacity     = 0.55,
  } = options;

  const animRef  = useRef<number>(0);
  const streams  = useRef<Stream[]>([]);

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

    const ro = new ResizeObserver(() => { resize(); initStreams(); });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const makeStream = (forceBottom = false): Stream => ({
      x:            Math.random() * canvas.width,
      y:            forceBottom
                      ? canvas.height + Math.random() * canvas.height
                      : Math.random() * canvas.height,
      speed:        speed * (0.5 + Math.random() * 1.2),
      length:       30 + Math.random() * 80,
      opacity:      0.3 + Math.random() * 0.7,
      width:        0.8 + Math.random() * 1.2,
      isAccent:     Math.random() < 0.15,
      char:         randomChar(),
      charTimer:    0,
      charInterval: 12 + Math.floor(Math.random() * 20),
      chars:        Array.from({ length: 6 }, () => randomChar()),
    });

    const initStreams = () => {
      streams.current = Array.from({ length: streamCount }, () => makeStream(false));
    };
    initStreams();

    let frame = 0;

    const draw = () => {
      // Fade rather than clear for trail effect
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frame++;

      const ss = streams.current;
      for (let i = 0; i < ss.length; i++) {
        const s = ss[i];

        // Move upward
        s.y -= s.speed;

        // Update char occasionally
        s.charTimer++;
        if (s.charTimer >= s.charInterval) {
          s.charTimer = 0;
          s.chars.shift();
          s.chars.push(randomChar());
        }

        // Reset stream when off-screen
        if (s.y + s.length < 0) {
          ss[i] = makeStream(true);
          continue;
        }

        const c = s.isAccent ? accentColor : color;

        // Draw the glowing stream line
        const grad = ctx.createLinearGradient(s.x, s.y + s.length, s.x, s.y);
        grad.addColorStop(0,    `rgba(${c}, 0)`);
        grad.addColorStop(0.4,  `rgba(${c}, ${s.opacity * opacity * 0.4})`);
        grad.addColorStop(0.85, `rgba(${c}, ${s.opacity * opacity})`);
        grad.addColorStop(1,    `rgba(${c}, ${s.opacity * opacity * 1.2})`);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y + s.length);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = s.width;
        ctx.stroke();

        // Bright head glow
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${c}, ${s.opacity * opacity * 1.5})`;
        ctx.fill();

        // Draw floating chars along the stream
        ctx.font      = `${8 + s.width * 2}px "SF Mono", "Fira Code", monospace`;
        ctx.textAlign = 'center';
        for (let k = 0; k < s.chars.length; k++) {
          const cy    = s.y + k * 12;
          const charO = (1 - k / s.chars.length) * s.opacity * opacity * 0.6;
          if (charO > 0.05 && cy > 0 && cy < canvas.height) {
            ctx.fillStyle = `rgba(${c}, ${charO})`;
            ctx.fillText(s.chars[k], s.x, cy);
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [streamCount, color, accentColor, speed, opacity]);
}
