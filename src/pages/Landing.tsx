import React from 'react';
import { motion } from 'motion/react';
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
import { Button } from '@/components/ui';

interface LandingProps {
  onEnter: () => void;
}

export function Landing({ onEnter }: LandingProps) {
  return (
    <div className="min-h-screen w-full bg-slate-950 text-white relative overflow-hidden font-sans flex flex-col justify-between selection:bg-teal-500/30 selection:text-teal-205">
      {/* Premium Apple-style background glowing blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-80 h-80 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/10">
            <HeartHandshake className="w-6 h-6 text-slate-950 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight uppercase font-mono leading-none">
              STARE Piura
            </h1>
            <p className="text-[9px] text-teal-400 font-mono tracking-widest uppercase mt-0.5 leading-none">
              Prefectura Zonal
            </p>
          </div>
        </div>
        <button
          onClick={onEnter}
          className="flex items-center gap-1.5 px-4.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
        >
          Acceder <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Hero Copy */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-mono uppercase tracking-wider font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            Plataforma Profesional Zonal • Offline-First
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] font-sans"
          >
            Trazabilidad inteligente <br className="hidden sm:inline" />
            para el <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent">apoyo social</span> en Piura
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-slate-400 max-w-2xl leading-relaxed"
          >
            STARE Piura conecta a micro-donantes locales (MYPEs) con comedores sociales y PRONOEIs. Asegura la cobertura y balances logísticos en caliente mediante tecnología offline-first diseñada para el clima y la geografía de la región.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <button
              onClick={onEnter}
              className="px-8 py-4.5 bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-sans font-black text-sm uppercase tracking-wider rounded-xl cursor-pointer shadow-xl shadow-teal-500/15 hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-2"
            >
              Iniciar Operaciones <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
            <a
              href="#caracteristicas"
              className="px-6 py-4.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-all text-center flex items-center justify-center"
            >
              Ver características
            </a>
          </motion.div>
        </div>

        {/* Hero Interactive Display (Stats Simulator Mockup) */}
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100, damping: 20 }}
            className="w-full max-w-[420px] mx-auto bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative"
          >
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

            {/* Core Metrics */}
            <div className="space-y-4">
              <div className="bg-slate-950/50 border border-slate-800/60 p-4.5 rounded-2xl flex flex-col justify-between">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Volumen Financiero Zonal</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-3xl font-black text-white font-mono">S/. 48,250.00</h3>
                  <span className="text-[10px] text-emerald-400 font-bold font-mono">▲ 12.4%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/30 border border-slate-800/40 p-4 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Cobertura</span>
                  <h4 className="text-2xl font-black text-amber-400 mt-1">94.8%</h4>
                  <p className="text-[9px] text-slate-400 mt-1 leading-none">Bolsas abastecidas</p>
                </div>
                <div className="bg-slate-950/30 border border-slate-800/40 p-4 rounded-2xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">MYPEs Activas</span>
                  <h4 className="text-2xl font-black text-teal-400 mt-1">54</h4>
                  <p className="text-[9px] text-slate-400 mt-1 leading-none">Comercios locales</p>
                </div>
              </div>

              {/* Simulated ledger entry */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono space-y-2">
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>HISTORIAL DE OPERACIONES</span>
                  <span>ONLINE</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-350">
                    <span className="text-teal-400">INYECCIÓN</span>
                    <span>S/. 1,200.00</span>
                  </div>
                  <div className="flex justify-between text-slate-350">
                    <span className="text-amber-400">DONACIÓN</span>
                    <span>Panadería Luján</span>
                  </div>
                  <div className="flex justify-between text-slate-350">
                    <span className="text-rose-400">COMPENSACIÓN</span>
                    <span>PRONOEI Catacaos</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="caracteristicas" className="w-full max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-widest bg-teal-500/5 border border-teal-500/10 px-3 py-1 rounded-full">
            Ventajas del Sistema
          </span>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-tight">
            Diseño Arquitectónico de Alta Fidelidad
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Una solución premium construida bajo los más altos estándares tecnológicos para garantizar la seguridad alimentaria y logística.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-teal-500/40 hover:bg-slate-900/60 transition-all group space-y-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <WifiOff className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Offline-First Extremo
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Registra actas de conformidad, firmas y fotos georreferenciadas en zonas de sierra y desierto sin señal móvil. Se sincroniza automáticamente al recuperar red.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-teal-500/40 hover:bg-slate-900/60 transition-all group space-y-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Arquitectura CQRS
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lecturas ultrarrápidas en tiempo real directamente desde Supabase WebSocket y escrituras seguras procesadas por la lógica transaccional de Laravel REST API.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-teal-500/40 hover:bg-slate-900/60 transition-all group space-y-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Empoderamiento MYPE
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Canaliza fondos directamente a las MYPEs afiliadas (bodegas, panaderías) para abastecer las brechas de comedores en sus respectivas zonas geográficas.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-teal-500/40 hover:bg-slate-900/60 transition-all group space-y-4">
            <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white uppercase tracking-tight">
              Seguridad RBAC
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Control de acceso basado en roles con enrutamiento seguro. El módulo financiero de Balance de Brechas se mantiene reservado estrictamente para administradores.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <p>© {new Date().getFullYear()} STARE Piura. Desarrollado para la Prefectura Zonal de Piura, Perú.</p>
          <div className="flex gap-4">
            <a href="#caracteristicas" className="hover:text-slate-350 hover:text-slate-300">Trazabilidad</a>
            <span>•</span>
            <a href="#caracteristicas" className="hover:text-slate-350 hover:text-slate-300">Privacidad y Seguridad</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
