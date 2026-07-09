import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import {
  HeartHandshake,
  WifiOff,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Store,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { useParticleCanvas }  from '@/animations/useParticleCanvas';
import { useDataFlowCanvas }  from '@/animations/useDataFlowCanvas';
import { listItemVariants, listContainerVariants } from '@/animations/variants';
import { useSoundState } from '@/animations/useSoundEffects';
import heroIllustration from '@/assets/hero_illustration.jpg';
import { useImageCanvasOverlay } from '@/animations/useImageCanvasOverlay';

interface LandingProps {
  onEnter: () => void;
}

// ── Componente para cards con reveal al scroll ───────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay?: number;
}) {
  const ref     = useRef<HTMLDivElement>(null);
  const inView  = useInView(ref, { once: true, margin: '-60px' });
  const { playHover } = useSoundState();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onMouseEnter={playHover}
      className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl hover:border-teal-500/40 hover:bg-slate-900/60 transition-colors group space-y-4 cursor-default"
    >
      <motion.div
        whileHover={{ scale: 1.15, rotate: 5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400"
      >
        <Icon className="w-6 h-6" />
      </motion.div>
      <h4 className="text-base font-bold text-white uppercase tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

// ── Componente métrica animada ───────────────────────────────────────────────
function AnimatedMetric({ value, label, color = 'text-white' }: { value: string; label: string; color?: string }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="bg-slate-950/50 border border-slate-800/60 p-4 rounded-2xl">
      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">{label}</span>
      <motion.div
        className={`text-3xl font-black font-mono mt-1 ${color}`}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {value}
      </motion.div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export function Landing({ onEnter }: LandingProps) {
  // Canvas refs
  const particleCanvasRef  = useRef<HTMLCanvasElement>(null);
  const dataFlowCanvasRef  = useRef<HTMLCanvasElement>(null);
  const imageCanvasRef     = useRef<HTMLCanvasElement>(null);
  const imageContainerRef  = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useSoundState();

  useImageCanvasOverlay(imageCanvasRef, imageContainerRef);

  // Parallax blobs
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useParticleCanvas(particleCanvasRef, {
    count:       65,
    color:       '45,212,191',
    accentColor: '251,191,36',
    maxDist:     100,
    speed:       0.3,
    radius:      1.8,
    opacity:     0.45,
  });

  useDataFlowCanvas(dataFlowCanvasRef, {
    streamCount: 14,
    color:       '45,212,191',
    accentColor: '251,191,36',
    speed:       0.7,
    opacity:     0.4,
  });

  // Parallax en blobs con mousemove
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-hidden font-sans flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-200">

      {/* ── Canvas: partículas fondo ── */}
      <canvas
        ref={particleCanvasRef}
        className="canvas-bg"
        aria-hidden="true"
      />

      {/* ── Blobs con parallax ── */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{ x: mousePos.x * 0.6, y: mousePos.y * 0.6 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[-10%] w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{ x: mousePos.x * -0.4, y: mousePos.y * -0.4 }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute top-[40%] right-[20%] w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"
        style={{ zIndex: 1 }}
        animate={{ x: mousePos.x * 0.3, y: mousePos.y * 0.3 }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0   }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 animate-glow"
          >
            <HeartHandshake className="w-6 h-6 text-slate-950 stroke-[1.8]" />
          </motion.div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase font-mono leading-none">
              STARE Piura
            </h1>
            <p className="text-[9px] text-teal-400 font-mono tracking-widest uppercase mt-0.5 leading-none">
              Prefectura Zonal
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={playHover}
          onClick={() => { playClick(); onEnter(); }}
          className="shimmer-sweep-effect flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          Acceder <ChevronRight className="w-3.5 h-3.5" />
        </motion.button>
      </motion.header>

      {/* ── Hero Section ── */}
      <main
        className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        style={{ zIndex: 2 }}
      >
        {/* Hero Copy */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0   }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-mono uppercase tracking-wider font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Plataforma Profesional Zonal • Offline-First
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] font-sans"
          >
            Trazabilidad inteligente <br className="hidden sm:inline" />
            para el{' '}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
              apoyo social
            </span>{' '}
            en Piura
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed"
          >
            STARE Piura conecta a micro-donantes locales (MYPEs) con comedores sociales y PRONOEIs. Asegura la cobertura y balances logísticos en caliente mediante tecnología offline-first diseñada para el clima y la geografía de la región.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onMouseEnter={playHover}
              onClick={() => { playClick(); onEnter(); }}
              className="shimmer-sweep-effect px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-sans font-black text-sm uppercase tracking-wider rounded-xl cursor-pointer shadow-xl shadow-teal-500/20 hover:shadow-teal-500/30 transition-colors flex items-center gap-2"
            >
              Iniciar Operaciones <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.02 }}
              onMouseEnter={playHover}
              onClick={playClick}
              href="#caracteristicas"
              className="px-6 py-4 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all text-center flex items-center justify-center"
            >
              Ver características
            </motion.a>
          </motion.div>
        </div>

        {/* Hero Panel — Command Center con canvas de flujo de datos */}
        <div className="lg:col-span-5 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.93, rotateY: 12 }}
            animate={{ opacity: 1, scale: 1,    rotateY: 0  }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 90, damping: 18 }}
            className="w-full max-w-[420px] mx-auto relative"
          >
            {/* Canvas de flujo de datos dentro del panel */}
            <div className="relative w-full rounded-3xl overflow-hidden">
              <canvas
                ref={dataFlowCanvasRef}
                className="canvas-bg rounded-3xl"
                style={{ zIndex: 0 }}
                aria-hidden="true"
              />

              <div className="relative bg-slate-900/75 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-xl shadow-2xl" style={{ zIndex: 1 }}>
                {/* Header del panel */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping" />
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                      Command Center Piura
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500/40" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/40" />
                    <span className="w-2 h-2 rounded-full bg-teal-500/40" />
                  </div>
                </div>

                {/* Métricas animadas */}
                <div className="space-y-4">
                  <AnimatedMetric value="S/. 48,250.00" label="Volumen Financiero Zonal" color="text-white" />

                  <div className="grid grid-cols-2 gap-4">
                    <AnimatedMetric value="94.8%" label="Cobertura" color="text-amber-400" />
                    <AnimatedMetric value="54"    label="MYPEs Activas" color="text-teal-400" />
                  </div>

                  {/* Ledger simulado */}
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                      <span>HISTORIAL DE OPERACIONES</span>
                      <span className="data-blink">ONLINE</span>
                    </div>
                    <motion.div
                      className="space-y-1.5 text-[11px]"
                      variants={listContainerVariants}
                      initial="initial"
                      animate="animate"
                    >
                      {[
                        { type: 'INYECCIÓN',    color: 'text-teal-400',  value: 'S/. 1,200.00'   },
                        { type: 'DONACIÓN',     color: 'text-amber-400', value: 'Panadería Luján' },
                        { type: 'COMPENSACIÓN', color: 'text-rose-400',  value: 'PRONOEI Catacaos'},
                      ].map((row) => (
                        <motion.div key={row.type} variants={listItemVariants} className="flex justify-between text-slate-350">
                          <span className={row.color}>{row.type}</span>
                          <span>{row.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Sección Multimedia: Visión Zonal e Impacto ── */}
      <section className="w-full max-w-7xl mx-auto px-6 py-16 border-t border-white/5 relative" style={{ zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Columna de Imagen Ilustrativa */}
          <div className="lg:col-span-6">
            <motion.div
              ref={imageContainerRef}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: 'spring' }}
              whileHover={{ scale: 1.015, rotate: 0.5 }}
              className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl group cursor-pointer"
            >
              <img
                src={heroIllustration}
                alt="Ayuda comunitaria en Piura"
                className="w-full h-auto object-cover max-h-[360px] filter brightness-95 group-hover:brightness-100 transition-all duration-300 select-none pointer-events-none"
              />
              <canvas
                ref={imageCanvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ zIndex: 6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-teal-400 font-bold uppercase tracking-wider bg-slate-950/80 px-2.5 py-1 rounded border border-white/5">
                Región Piura, Perú
              </div>
            </motion.div>
          </div>

          {/* Columna de Texto Descriptivo */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full inline-block"
            >
              Multimedia & Solidaridad
            </motion.span>
            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-2xl sm:text-3xl font-black uppercase tracking-tight"
            >
              Conectando MYPEs con Comedores Sociales
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs sm:text-sm text-slate-400 leading-relaxed"
            >
              El programa STARE Piura optimiza la distribución alimentaria local en tiempo real. Mediante un flujo constante y mapeo de brechas geográficas, empoderamos la economía local abasteciendo a quienes más lo necesitan sin demoras burocráticas.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-2 text-xs font-mono text-slate-350"
            >
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Mapeo de Cobertura en Catacaos y Sullana
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Sincronización Inteligente Offline/Online
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Transacciones Verificadas bajo Cifrado Seguro
              </li>
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ── Features Grid Section ── */}
      <section id="caracteristicas" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative" style={{ zIndex: 2 }}>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest bg-teal-500/5 border border-teal-500/10 px-3 py-1 rounded-full inline-block"
          >
            Ventajas del Sistema
          </motion.span>

          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight"
          >
            Diseño Arquitectónico de Alta Fidelidad
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400 leading-relaxed"
          >
            Una solución premium construida bajo los más altos estándares tecnológicos para garantizar la seguridad alimentaria y logística.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={WifiOff}
            title="Offline-First Extremo"
            description="Registra actas de conformidad, firmas y fotos georreferenciadas en zonas de sierra y desierto sin señal móvil. Se sincroniza automáticamente al recuperar red."
            delay={0}
          />
          <FeatureCard
            icon={Layers}
            title="Arquitectura CQRS"
            description="Lecturas ultrarrápidas en tiempo real directamente desde Supabase WebSocket y escrituras seguras procesadas por la lógica transaccional de Laravel REST API."
            delay={0.08}
          />
          <FeatureCard
            icon={Store}
            title="Empoderamiento MYPE"
            description="Canaliza fondos directamente a las MYPEs afiliadas (bodegas, panaderías) para abastecer las brechas de comedores en sus respectivas zonas geográficas."
            delay={0.16}
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Seguridad RBAC"
            description="Control de acceso basado en roles con enrutamiento seguro. El módulo financiero de Balance de Brechas se mantiene reservado estrictamente para administradores."
            delay={0.24}
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-white/5 bg-slate-950/80 py-8 relative" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} STARE Piura. Desarrollado para la Prefectura Zonal de Piura, Perú.</p>
          <div className="flex gap-4">
            <a href="#caracteristicas" className="hover:text-slate-300 transition-colors">Trazabilidad</a>
            <span>•</span>
            <a href="#caracteristicas" className="hover:text-slate-300 transition-colors">Privacidad y Seguridad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
