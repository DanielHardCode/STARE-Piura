/**
 * @file src/components/ui/Card.tsx
 * @description Componente Card del design system de STARE Piura.
 * Variantes: default | elevated | glass | bordered
 * Slots: header, body (children), footer
 * Soporta hover effect con Framer Motion
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { springs } from '@/animations/variants';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant = 'default' | 'elevated' | 'glass' | 'bordered';

export interface CardProps {
  variant?: CardVariant;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  hoverable?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<CardVariant, string> = {
  default: [
    'bg-[var(--color-bg-primary)]',
    'border border-[var(--color-border)]',
    'shadow-[var(--shadow-sm)]',
    'rounded-[var(--radius-xl)]',
  ].join(' '),

  elevated: [
    'bg-[var(--color-bg-elevated)]',
    'border border-[var(--color-border-subtle)]',
    'shadow-[var(--shadow-md)]',
    'rounded-[var(--radius-2xl)]',
  ].join(' '),

  glass: [
    'glass',
    'rounded-[var(--radius-xl)]',
    'shadow-[var(--shadow-md)]',
  ].join(' '),

  bordered: [
    'bg-[var(--color-bg-primary)]',
    'border-2 border-[var(--color-border-strong)]',
    'rounded-[var(--radius-xl)]',
  ].join(' '),
};

const paddingStyles = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div
      className={cn(
        'px-5 py-3 border-t border-[var(--color-border)] flex items-center justify-between',
        'bg-[var(--color-bg-secondary)] rounded-b-[var(--radius-xl)]',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Card({
  variant = 'default',
  header,
  footer,
  children,
  className,
  bodyClassName,
  hoverable = false,
  onClick,
  padding = 'md',
}: CardProps) {
  const isInteractive = hoverable || !!onClick;

  return (
    <motion.div
      whileHover={
        isInteractive
          ? { scale: 1.005, boxShadow: 'var(--shadow-lg)', transition: springs.snappy }
          : {}
      }
      onClick={onClick}
      className={cn(
        'overflow-hidden',
        variantStyles[variant],
        isInteractive && 'cursor-pointer',
        className
      )}
    >
      {/* Header slot */}
      {header && (
        typeof header === 'string'
          ? (
            <div className="px-5 py-4 border-b border-[var(--color-border)]">
              <h3 className="font-semibold text-[var(--color-text-primary)] text-sm">{header}</h3>
            </div>
          )
          : header
      )}

      {/* Body */}
      <div className={cn(!header && !footer ? paddingStyles[padding] : 'px-5 py-4', bodyClassName)}>
        {children}
      </div>

      {/* Footer slot */}
      {footer && footer}
    </motion.div>
  );
}

// ─── Stat Card variant ────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  accentColor = 'teal',
  className,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <Card hoverable className={cn('min-w-0', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="mt-1.5 text-2xl font-bold text-[var(--color-text-primary)] tabular-nums">
            {value}
          </p>
          {subtext && (
            <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] truncate">
              {subtext}
            </p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-1 text-xs font-medium',
                isPositive ? 'text-emerald-600' : 'text-red-500'
              )}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0',
              `bg-${accentColor}-50 text-${accentColor}-600`
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
