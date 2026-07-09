/**
 * @file src/layouts/AppLayout.tsx
 * @description Shell principal de STARE Piura.
 * Orquesta: Sidebar (desktop), BottomNav (mobile), Header con glassmorphism,
 * area de contenido principal con page transitions via AnimatePresence.
 *
 * Gestiona estado de: colapso del sidebar, dark mode (persiste en localStorage).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, Menu, X, LogOut, MapPin, Wifi, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pageVariants, springs } from '@/animations/variants';
import { Avatar, CountBadge } from '@/components/ui';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuthStore } from '@/stores/auth';
import type { ActiveScreen } from '@/app/config/app.config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppLayoutProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  children: React.ReactNode;
  notificationCount?: number;
}

// ─── Screen Titles ────────────────────────────────────────────────────────────

const screenTitles: Record<ActiveScreen, string> = {
  dashboard:      'Command Center',
  captacion:      'Captación de Microdonaciones',
  balance:        'Balance Financiero y Brechas',
  voluntario:     'Cronograma de Visitas',
  organizaciones: 'Organizaciones Beneficiarias',
  eventos:        'Eventos y Jornadas de Ayuda',
  usuarios:       'Gestión de Usuarios',
};

const screenSubtitles: Record<ActiveScreen, string> = {
  dashboard:      'Fondos · Kardex · Cobertura de Bolsas',
  captacion:      'Registro de donaciones monetarias y en especie',
  balance:        'Análisis de déficits y balanceo automático',
  voluntario:     'Visitas de asistencia social programadas',
  organizaciones: 'Comedores, asilos, vasos de leche y albergues',
  eventos:        'Planificación de jornadas de apoyo social en Piura',
  usuarios:       'Administración de accesos y roles (RBAC)',
};

// ─── Hook: Dark Mode ──────────────────────────────────────────────────────────

function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('stare_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('stare_dark_mode', String(isDark));
  }, [isDark]);

  const toggle = useCallback(() => setIsDark((d) => !d), []);
  return { isDark, toggle };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AppLayout({
  activeScreen,
  onNavigate,
  children,
  notificationCount = 0,
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuthStore();
  const isVoluntario = user?.role === 'voluntario';

  // Sidebar width offset for main content
  const sidebarWidth = isVoluntario ? 0 : (sidebarCollapsed ? 68 : 256);

  return (
    <div className="min-h-dvh bg-[var(--color-bg-base)]">
      {/* ── Desktop Sidebar ── */}
      {!isVoluntario && (
        <Sidebar
        activeScreen={activeScreen}
        onNavigate={onNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        notificationCount={notificationCount}
        isDarkMode={isDark}
        onToggleDarkMode={toggleDarkMode}
      />
      )}

      {/* ── Mobile Overlay Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && !isVoluntario && (
          <>
            <motion.div
              key="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--color-bg-overlay)] backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              key="mobile-menu"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={springs.soft}
              className={cn(
                'fixed top-0 left-0 h-full w-72 z-[var(--z-modal)]',
                'bg-[var(--color-bg-primary)] border-r border-[var(--color-border)]',
                'shadow-[var(--shadow-xl)]',
                'lg:hidden',
                'flex flex-col'
              )}
            >
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-teal-600 rounded-[var(--radius-md)] flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[var(--color-text-primary)] leading-none">STARE Piura</p>
                    <p className="text-[9px] text-[var(--color-text-tertiary)] mt-0.5 leading-tight pr-2">Sistema de Trazabilidad y Asignación de Recursos</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile nav items */}
              <nav className="flex-1 px-3 py-4 space-y-1">
                {(
                  [
                    ['dashboard', 'Command Center'],
                    ['captacion', 'Microdonaciones'],
                    ['balance', 'Balance y Brechas'],
                    ['voluntario', 'Visitas de Campo'],
                    ['organizaciones', 'Organizaciones'],
                  ] as [ActiveScreen, string][]
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => { onNavigate(id); setMobileMenuOpen(false); }}
                    className={cn(
                      'flex items-center w-full px-4 py-3 rounded-[var(--radius-lg)]',
                      'text-sm font-medium transition-colors duration-150',
                      activeScreen === id
                        ? 'bg-teal-600 text-white'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              {/* Dark mode toggle mobile */}
              <div className="px-3 py-4 border-t border-[var(--color-border)]">
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-[var(--radius-lg)] text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] transition-colors"
                >
                  {isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <div
        className={cn(
          "transition-[padding-left] duration-300 ease-[0.32,0.72,0,1] lg:pb-0 pb-20",
          !isVoluntario && sidebarCollapsed ? "lg:pl-[68px]" : "",
          !isVoluntario && !sidebarCollapsed ? "lg:pl-[256px]" : ""
        )}
      >
        {/* ── Top Header ── */}
        {isVoluntario ? (
          <header className={cn('sticky top-0 z-[var(--z-header)]', 'glass border-b border-[var(--color-border)]', 'px-4 sm:px-6 py-4', 'flex items-center justify-between gap-4')}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-teal-600 rounded-[var(--radius-md)] flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-white" aria-hidden />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-sm font-bold text-[var(--color-text-primary)] leading-none">STARE Piura</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 leading-none">Voluntariado</p>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
                <Wifi className="w-3.5 h-3.5" />
                Online
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{user?.nombre || 'Voluntario'}</p>
              </div>
              <button onClick={logout} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold hidden sm:block">Salir</span>
              </button>
            </div>
          </header>
        ) : (
          <header
          className={cn(
            'sticky top-0 z-[var(--z-header)]',
            'glass border-b border-[var(--color-border)]',
            'px-4 sm:px-6 py-4',
            'flex items-center justify-between gap-4'
          )}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeScreen}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
              >
                <h1 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] truncate leading-snug">
                  {screenTitles[activeScreen]}
                </h1>
                <p className="text-xs text-[var(--color-text-tertiary)] truncate hidden sm:block">
                  {screenSubtitles[activeScreen]}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className={cn(
                  'relative p-2 rounded-[var(--radius-lg)]',
                  'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
                  'transition-colors duration-150'
                )}
                aria-label={`Notificaciones: ${notificationCount}`}
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5">
                    <CountBadge count={notificationCount} />
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-72 bg-[var(--color-bg-primary)] border border-[var(--color-border)] shadow-xl rounded-2xl overflow-hidden z-[100]"
                  >
                    <div className="p-3 border-b border-[var(--color-border)] font-bold text-sm text-[var(--color-text-primary)] flex justify-between items-center">
                      Notificaciones
                      <span className="text-[10px] bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">{notificationCount > 0 ? `${notificationCount} nuevas` : 'Al día'}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
                        <p className="text-xs font-semibold text-[var(--color-text-primary)] pl-1">Nueva Mype Aliada</p>
                        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5 pl-1">Panadería San José (Catacaos) se unió a la red de donantes.</p>
                        <p className="text-[9px] text-[var(--color-text-tertiary)] mt-1 pl-1 font-mono">Hace 2 horas</p>
                      </div>
                      <div className="p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors">
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">Jornada Confirmada</p>
                        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">El evento en el Comedor Las Mercedes está listo para mañana.</p>
                        <p className="text-[9px] text-[var(--color-text-tertiary)] mt-1 font-mono">Hace 5 horas</p>
                      </div>
                      <div className="p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] cursor-pointer transition-colors">
                        <p className="text-xs font-semibold text-[var(--color-text-primary)]">Alerta de Insumos</p>
                        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">La meta de donación para Sullana se completó al 100%.</p>
                        <p className="text-[9px] text-[var(--color-text-tertiary)] mt-1 font-mono">Ayer</p>
                      </div>
                    </div>
                    <div className="p-2 text-center border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                      <button className="text-[11px] font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">Marcar todas como leídas</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar (desktop only) */}
            <div className="hidden sm:block">
              <Avatar name="Coordinador Piura" size="sm" online />
            </div>
          </div>
        </header>
        )}

        {/* ── Page Content ── */}
        <main className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ willChange: 'opacity, transform' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      {!isVoluntario && <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} />}
    </div>
  );
}
