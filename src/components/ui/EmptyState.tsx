/**
 * @file src/components/ui/EmptyState.tsx
 * @description Componente EmptyState del design system de STARE Piura.
 * Se usa cuando una lista o sección no tiene datos.
 * Soporta: icono SVG ilustrado, título, descripción, acción CTA.
 * Animación de entrada: fade + slide-up con Framer Motion.
 */

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { fadeUpVariants } from '@/animations/variants';
import { Button, type ButtonVariant } from './Button';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// ─── Default Icons ────────────────────────────────────────────────────────────

export function EmptyBoxIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      <rect x="8" y="22" width="48" height="34" rx="4" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 28h48" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 22l4-14h8l4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 40h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <path d="M26 47h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    </svg>
  );
}

export function EmptyCalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      <rect x="8" y="14" width="48" height="42" rx="6" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 26h48" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 8v12M42 8v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="32" cy="42" r="8" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
      <path d="M29 42l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
    </svg>
  );
}

export function EmptySearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-full h-full', className)}
    >
      <circle cx="28" cy="28" r="18" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="2"/>
      <path d="M41 41l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M22 28h12M28 22v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const sizeConfig = {
  sm: { icon: 'w-12 h-12', title: 'text-sm', description: 'text-xs', container: 'py-8 gap-3' },
  md: { icon: 'w-16 h-16', title: 'text-base', description: 'text-sm', container: 'py-12 gap-4' },
  lg: { icon: 'w-24 h-24', title: 'text-xl', description: 'text-base', container: 'py-16 gap-5' },
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const cfg = sizeConfig[size];

  return (
    <motion.div
      variants={fadeUpVariants}
      initial="initial"
      animate="animate"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        cfg.container,
        'px-6',
        className
      )}
    >
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            cfg.icon,
            'text-[var(--color-text-tertiary)]',
            'mb-1'
          )}
        >
          {icon}
        </div>
      )}

      {!icon && (
        <div className={cn(cfg.icon, 'text-[var(--color-text-tertiary)] mb-1')}>
          <EmptyBoxIcon />
        </div>
      )}

      {/* Title */}
      <h3 className={cn('font-semibold text-[var(--color-text-secondary)]', cfg.title)}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={cn('text-[var(--color-text-tertiary)] max-w-xs leading-relaxed', cfg.description)}>
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
          {action && (
            <Button
              variant={action.variant ?? 'primary'}
              size="sm"
              leadingIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
