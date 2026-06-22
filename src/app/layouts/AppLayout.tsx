/**
 * @file AppLayout.tsx
 * @description Layout principal de la aplicación STARE Piura.
 * Contiene el sidebar de escritorio, el header móvil, el drawer móvil y el footer.
 * Extraído de App.tsx para cumplir el principio de Separación de Responsabilidades.
 */
import React from 'react';
import { Activity, Scale, Sparkles, Building2, Compass, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveScreen } from '../config/app.config';

interface AppLayoutProps {
  children: React.ReactNode;
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  overallCoveragePct: number;
}

const NAV_ITEMS: { screen: ActiveScreen; label: string; icon: React.ReactNode }[] = [
  { screen: 'dashboard', label: 'Command-Center Logístico', icon: <Activity className="w-4 h-4 shrink-0" /> },
  { screen: 'captacion', label: 'Captación Microdonaciones', icon: <Sparkles className="w-4 h-4 shrink-0" /> },
  { screen: 'organizaciones', label: 'Organizaciones y Eventos', icon: <Building2 className="w-4 h-4 shrink-0" /> },
  { screen: 'balance', label: 'Balance Financiero y Brechas', icon: <Scale className="w-4 h-4 shrink-0" /> },
];

export function AppLayout({
  children,
  activeScreen,
  onNavigate,
  mobileMenuOpen,
  onToggleMobileMenu,
  overallCoveragePct,
}: AppLayoutProps) {
  const navButtonClass = (screen: ActiveScreen, variant: 'desktop' | 'mobile') => {
    const active = activeScreen === screen;
    if (variant === 'desktop') {
      return `w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-sans font-bold text-[11px] uppercase tracking-wider text-left transition-all border-2 cursor-pointer ${
        active
          ? 'bg-amber-400 border-slate-950 text-slate-950 font-black shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]'
          : 'border-transparent text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-700'
      }`;
    }
    return `w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider text-left transition-all cursor-pointer ${
      active
        ? 'bg-amber-400 text-slate-950 font-black shadow-md'
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-slate-900 border-b-2 border-slate-950 text-white p-4 sticky top-0 z-40 flex items-center justify-between shadow-md shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-400 border border-slate-950 text-slate-950 rounded-lg">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-tight text-white uppercase">STARE Piura</h1>
            <p className="text-[7.5px] text-slate-350 font-mono tracking-widest uppercase">Recursos de Apoyo Social</p>
          </div>
        </div>
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-700 cursor-pointer transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onToggleMobileMenu}
              className="fixed inset-0 bg-slate-950/60"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-72 max-w-full bg-slate-900 border-r-2 border-slate-950 text-white flex flex-col p-6 h-full shadow-2xl z-50 overflow-y-auto font-sans"
            >
              <div className="flex items-center gap-2.5 border-b border-slate-800 pb-5 mb-6">
                <div className="p-2 bg-amber-400 border border-slate-950 text-slate-950 rounded-xl">
                  <Activity className="w-6 h-6 text-slate-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h1 className="text-base font-black text-white">S T A R E</h1>
                    <span className="text-[9px] font-mono font-bold text-amber-400 bg-slate-800 px-1.5 py-0.5 rounded border border-amber-400/20">Piura</span>
                  </div>
                  <p className="text-[8px] text-slate-350 font-sans tracking-tight leading-tight mt-1">
                    Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
                  </p>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                <p className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest mb-3">Navegación</p>
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.screen}
                    onClick={() => { onNavigate(item.screen); onToggleMobileMenu(); }}
                    className={navButtonClass(item.screen, 'mobile')}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-slate-800 pt-5 mt-auto space-y-4 text-left">
                <div className="font-mono">
                  <p className="text-[8px] text-slate-500 uppercase block font-bold">Base de Operaciones</p>
                  <p className="text-xs text-white">Prefectura Zonal de Piura, Perú</p>
                </div>
                <div className="bg-slate-850 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-slate-400 font-mono">COBERTURA ZONAL</span>
                    <span className="text-xs font-black text-amber-400 font-mono">{overallCoveragePct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${overallCoveragePct}%` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-72 bg-slate-900 border-r-4 border-slate-950 text-white flex-col p-6 shrink-0 z-40 sticky top-0 h-screen overflow-y-auto select-none font-sans">
        <div className="flex items-center gap-3 border-b-2 border-slate-800 pb-5 mb-6 shrink-0">
          <div className="p-2 bg-amber-400 border-2 border-slate-950 text-slate-950 rounded-2xl shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
            <Activity className="w-6 h-6 text-slate-900 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-black tracking-tight text-white uppercase">
              S T A R E <span className="text-amber-400 font-black font-mono text-[9px] px-1.5 py-0.5 rounded border border-amber-400 bg-slate-800 ml-1">Piura</span>
            </h1>
            <p className="text-[9px] text-slate-350 font-sans tracking-tight leading-tight mt-1">
              Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 mt-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={navButtonClass(item.screen, 'desktop')}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t-2 border-slate-800 pt-5 mt-auto space-y-5 shrink-0">
          <div className="flex items-center gap-2.5 bg-slate-850 px-3 py-2.5 rounded-2xl border border-slate-800">
            <Compass className="text-slate-400 w-4 h-4 shrink-0 animate-spin-slow" />
            <div className="text-left font-mono">
              <p className="text-[8px] text-slate-400 leading-none uppercase font-bold">Base Regional</p>
              <p className="text-[10px] text-white font-bold">Piura, Perú</p>
            </div>
          </div>
          <div className="bg-slate-850 p-3.5 rounded-2xl border border-slate-850 text-left space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[8.5px] text-slate-400 font-mono font-bold uppercase">Cobertura Zonal</span>
              <span className="text-xs font-black text-amber-400 font-mono">{overallCoveragePct.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-750">
              <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={{ width: `${overallCoveragePct}%` }} />
            </div>
          </div>
          <div className="text-[9.5px] text-slate-400 font-mono leading-tight bg-slate-800/45 p-2 rounded-xl flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span>Enfoque Offline-First Activo</span>
          </div>
        </div>
      </aside>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {children}

        {/* FOOTER */}
        <footer className="mt-auto bg-slate-900 text-slate-400 text-center py-6 px-4 border-t-2 border-slate-950 font-mono text-2xs leading-relaxed shrink-0">
          <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
            <p>STARE Piura • Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social.</p>
            <p>Piura, Perú • Enfoque Offline-first y microdonaciones MYPE locales.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
