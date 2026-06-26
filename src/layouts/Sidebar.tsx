/**
 * @file src/layouts/Sidebar.tsx
 * @description Sidebar de navegación principal para desktop (>1024px).
 * Colapsable con animación spring. Logo, navegación con iconos, avatar de usuario,
 * badge de notificaciones y toggle de dark mode.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  CalendarDays,
  Package,
  HandHeart,
  Building2,
  Store,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  MapPin,
  Users,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs, sidebarVariants, sidebarLabelVariants } from '@/animations/variants';
import { Avatar, CountBadge } from '@/components/ui';
import type { ActiveScreen } from '@/app/config/app.config';
import { useAuthStore } from '@/stores/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  notificationCount?: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

// ─── Nav Items ────────────────────────────────────────────────────────────────

const navItems: Array<{
  id: ActiveScreen;
  label: string;
  icon: React.ElementType;
  badge?: string;
}> = [
  { id: 'dashboard',      label: 'Command Center',        icon: LayoutDashboard },
  { id: 'captacion',      label: 'Microdonaciones',       icon: HandHeart },
  { id: 'balance',        label: 'Balance y Brechas',     icon: BarChart3 },
  { id: 'organizaciones', label: 'Organizaciones',        icon: Building2 },
  { id: 'eventos',        label: 'Eventos de Ayuda',      icon: CalendarDays },
  { id: 'voluntario',     label: 'Visitas de Campo',      icon: MapPin },
];

const secondaryItems: Array<{
  id: ActiveScreen;
  label: string;
  icon: React.ElementType;
}> = [
  { id: 'usuarios', label: 'Usuarios y Roles', icon: Users },
];

// ─── Nav Item Component ───────────────────────────────────────────────────────

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, transition: springs.stiff }}
      whileTap={{ scale: 0.97, transition: springs.stiff }}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative flex items-center gap-3 w-full px-3 py-2.5',
        'rounded-[var(--radius-lg)] text-sm font-medium',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
        isActive
          ? 'bg-teal-600 text-white shadow-[var(--shadow-md)]'
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
      )}
    >
      {/* Active indicator */}
      {isActive && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute inset-0 bg-teal-600 rounded-[var(--radius-lg)]"
          transition={springs.snappy}
          style={{ zIndex: -1 }}
        />
      )}

      <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-white' : '')} aria-hidden />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            variants={sidebarLabelVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="truncate text-left"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Sidebar({
  activeScreen,
  onNavigate,
  collapsed,
  onToggleCollapse,
  notificationCount = 0,
  isDarkMode,
  onToggleDarkMode,
}: SidebarProps) {
  const { user, logout } = useAuthStore();

  const filteredNavItems = navItems.filter((item) => {
    if (item.id === 'balance') {
      return user?.role === 'admin';
    }
    return true;
  });

  const filteredSecondaryItems = secondaryItems.filter((item) => {
    if (item.id === 'usuarios') {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      initial={false}
      className={cn(
        'fixed top-0 left-0 h-full z-[var(--z-sidebar)]',
        'flex flex-col',
        'bg-[var(--color-bg-primary)] border-r border-[var(--color-border)]',
        'shadow-[var(--shadow-md)]',
        // Hidden on mobile/tablet
        'hidden lg:flex'
      )}
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-5',
          'border-b border-[var(--color-border)]',
          collapsed ? 'justify-center' : 'justify-between'
        )}
      >
        {!collapsed && (
          <motion.div
            variants={sidebarLabelVariants}
            initial="collapsed"
            animate="expanded"
            className="flex items-center gap-2.5 min-w-0"
          >
            <div className="w-8 h-8 bg-teal-600 rounded-[var(--radius-md)] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--color-text-primary)] leading-none">
                STARE Piura
              </p>
              <p className="text-[9px] text-[var(--color-text-tertiary)] mt-0.5 leading-tight pr-1">
                Sistema de Trazabilidad y Asignación de Recursos
              </p>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <div className="w-8 h-8 bg-teal-600 rounded-[var(--radius-md)] flex items-center justify-center">
            <Target className="w-4 h-4 text-white" aria-hidden />
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navegación principal">
        {filteredNavItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeScreen === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate(item.id)}
          />
        ))}

        {filteredSecondaryItems.length > 0 && (
          <>
            <div className="my-3 border-t border-[var(--color-border)]" />
            {filteredSecondaryItems.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={activeScreen === item.id}
                collapsed={collapsed}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </>
        )}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="px-3 py-4 border-t border-[var(--color-border)] space-y-2">
        {/* Dark mode toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5',
            'rounded-[var(--radius-lg)] text-sm font-medium',
            'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
            'transition-colors duration-150',
            collapsed && 'justify-center'
          )}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 shrink-0" aria-hidden />
          ) : (
            <Moon className="w-5 h-5 shrink-0" aria-hidden />
          )}
          {!collapsed && (
            <motion.span variants={sidebarLabelVariants} initial="collapsed" animate="expanded">
              {isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            </motion.span>
          )}
        </motion.button>

        {/* User avatar and logout action */}
        <div
          className={cn(
            'flex items-center gap-3 px-2 py-1.5 border border-slate-200/20 rounded-xl relative group bg-slate-500/5',
            collapsed && 'flex-col justify-center gap-2'
          )}
        >
          <Avatar name={user?.nombre || 'Usuario'} size="sm" online />
          {!collapsed ? (
            <>
              <motion.div
                variants={sidebarLabelVariants}
                initial="collapsed"
                animate="expanded"
                className="flex-1 min-w-0"
              >
                <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                  {user?.nombre || 'Usuario'}
                </p>
                <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                  {user?.email || ''}
                </p>
              </motion.div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-md transition-colors shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-1 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 rounded-md transition-colors w-7 h-7 flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Collapse Toggle ── */}
      <motion.button
        onClick={onToggleCollapse}
        whileHover={{ scale: 1.1, transition: springs.stiff }}
        whileTap={{ scale: 0.9, transition: springs.stiff }}
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        className={cn(
          'absolute -right-3 top-20',
          'w-6 h-6 rounded-full',
          'bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
          'shadow-[var(--shadow-md)]',
          'flex items-center justify-center',
          'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500'
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </motion.button>
    </motion.aside>
  );
}
