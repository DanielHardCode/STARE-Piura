import { useEffect, RefObject } from 'react';

export function useImageCanvasOverlay(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  containerRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // Adjust for device pixel ratio to maintain quality
        const dpr = window.devicePixelRatio || 1;
        width = canvas.width = entry.contentRect.width * dpr;
        height = canvas.height = entry.contentRect.height * dpr;
        ctx.scale(dpr, dpr);
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
    });
    resizeObserver.observe(container);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      decay: number;
      color: string;
    }

    const particles: Particle[] = [];

    // Track mouse
    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Account for DPI scaling on rect
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      // Spawn interactive sparks on mouse hover
      if (Math.random() < 0.4) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 1.8,
          vy: (Math.random() - 0.5) * 1.8 - 0.5,
          radius: Math.random() * 2 + 1,
          alpha: 1.0,
          decay: Math.random() * 0.03 + 0.015,
          color: Math.random() < 0.6 ? '#2dd4bf' : '#fbbf24', // teal / amber
        });
      }
    };

    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn sutil ambient floating light specs slowly
      if (Math.random() < 0.08 && particles.length < 40) {
        particles.push({
          x: Math.random() * width,
          y: height + 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.3,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.6 + 0.2,
          decay: Math.random() * 0.004 + 0.002,
          color: Math.random() < 0.7 ? '#2dd4bf' : '#fbbf24',
        });
      }

      // Render and update
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, [canvasRef, containerRef]);
}
