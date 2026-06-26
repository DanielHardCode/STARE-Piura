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
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)] truncate leading-snug">
                {screenTitles[activeScreen]}
              </h1>
              <p className="text-xs text-[var(--color-text-tertiary)] truncate hidden sm:block">
                {screenSubtitles[activeScreen]}
              </p>
            </motion.div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
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
