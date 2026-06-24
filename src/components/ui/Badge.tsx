/**
 * @file src/components/ui/Badge.tsx
 * @description Componente Badge del design system de STARE Piura.
 * Variantes de color: teal | amber | red | green | blue | slate | purple | orange
 * Tamaños: sm | md
 * Opciones: dot indicator, icono
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BadgeColor =
  | 'teal'
  | 'amber'
  | 'red'
  | 'green'
  | 'blue'
  | 'slate'
  | 'purple'
  | 'orange'
  | 'pink';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  color?: BadgeColor;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const colorStyles: Record<BadgeColor, { badge: string; dot: string }> = {
  teal: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
  },
  amber: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  red: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
  green: {
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  blue: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
  },
  slate: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
  },
  orange: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  pink: {
    badge: 'bg-pink-50 text-pink-700 border-pink-200',
    dot: 'bg-pink-500',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-2 py-0.5 gap-1 rounded-full',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-full',
};

const dotSizes: Record<BadgeSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Badge({
  color = 'slate',
  size = 'md',
  dot = false,
  icon,
  children,
  className,
}: BadgeProps) {
  const { badge, dot: dotColor } = colorStyles[color];

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold border',
        'whitespace-nowrap leading-none',
        sizeStyles[size],
        badge,
        className
      )}
    >
      {dot && !icon && (
        <span
          className={cn(
            'rounded-full shrink-0 animate-[pulse-dot_2s_ease-in-out_infinite]',
            dotColor,
            dotSizes[size]
          )}
          aria-hidden
        />
      )}
      {icon && !dot && (
        <span className="shrink-0" aria-hidden>
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

// ─── Status Badge (evento) ────────────────────────────────────────────────────

export type EventStatusLabel = 'programada' | 'en_curso' | 'realizada' | 'cancelada';

const statusMap: Record<EventStatusLabel, { color: BadgeColor; label: string }> = {
  programada: { color: 'amber', label: 'Programada' },
  en_curso:   { color: 'teal',  label: 'En Curso' },
  realizada:  { color: 'green', label: 'Realizada' },
  cancelada:  { color: 'red',   label: 'Cancelada' },
};

export function StatusBadge({
  status,
  size = 'md',
}: {
  status: EventStatusLabel;
  size?: BadgeSize;
}) {
  const { color, label } = statusMap[status];
  return (
    <Badge color={color} size={size} dot>
      {label}
    </Badge>
  );
}

// ─── Count Badge ──────────────────────────────────────────────────────────────

export function CountBadge({
  count,
  max = 99,
  className,
}: {
  count: number;
  max?: number;
  className?: string;
}) {
  if (count === 0) return null;
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'min-w-[18px] h-[18px] px-1',
        'text-[10px] font-bold text-white leading-none',
        'bg-red-500 rounded-full',
        className
      )}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}
