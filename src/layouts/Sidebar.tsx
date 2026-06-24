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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs, sidebarVariants, sidebarLabelVariants } from '@/animations/variants';
import { Avatar, CountBadge } from '@/components/ui';
import type { ActiveScreen } from '@/app/config/app.config';

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
  { id: 'voluntario',     label: 'Visitas de Campo',      icon: CalendarDays },
  { id: 'organizaciones', label: 'Organizaciones',        icon: Building2 },
];

const secondaryItems: Array<{
  id: ActiveScreen;
  label: string;
  icon: React.ElementType;
}> = [
  // En fases futuras se agregarán más aquí
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
              <MapPin className="w-4 h-4 text-white" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--color-text-primary)] leading-none">
                STARE Piura
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 leading-none">
                Prefectura Zonal
              </p>
            </div>
          </motion.div>
        )}

        {collapsed && (
          <div className="w-8 h-8 bg-teal-600 rounded-[var(--radius-md)] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-white" aria-hidden />
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Navegación principal">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={activeScreen === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate(item.id)}
          />
        ))}

        {secondaryItems.length > 0 && (
          <>
            <div className="my-3 border-t border-[var(--color-border)]" />
            {secondaryItems.map((item) => (
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

        {/* User avatar */}
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2',
            collapsed && 'justify-center'
          )}
        >
          <Avatar name="Coordinador Piura" size="sm" online />
          {!collapsed && (
            <motion.div
              variants={sidebarLabelVariants}
              initial="collapsed"
              animate="expanded"
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate">
                Coordinador Piura
              </p>
              <p className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                coordinador@piura.gob.pe
              </p>
            </motion.div>
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
