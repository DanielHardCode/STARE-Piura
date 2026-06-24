/**
 * @file src/components/ui/Button.tsx
 * @description Componente Button del design system de STARE Piura.
 * Variantes: primary | secondary | ghost | danger | outline
 * Tamaños: sm | md | lg
 * Soporta: loading, disabled, icono leading/trailing, animaciones Framer Motion
 */

import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
  id?: string;
  name?: string;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-teal-600 text-white',
    'hover:bg-teal-700',
    'border border-teal-700/20',
    'shadow-sm hover:shadow-md',
    'disabled:bg-teal-400 disabled:cursor-not-allowed',
  ].join(' '),

  secondary: [
    'bg-amber-500 text-white',
    'hover:bg-amber-600',
    'border border-amber-600/20',
    'shadow-sm hover:shadow-md',
    'disabled:bg-amber-300 disabled:cursor-not-allowed',
  ].join(' '),

  ghost: [
    'bg-transparent text-slate-600',
    'hover:bg-slate-100 hover:text-slate-900',
    'border border-transparent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),

  outline: [
    'bg-transparent text-teal-700',
    'border border-teal-300',
    'hover:bg-teal-50 hover:border-teal-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),

  danger: [
    'bg-red-600 text-white',
    'hover:bg-red-700',
    'border border-red-700/20',
    'shadow-sm',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-lg)]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[var(--radius-xl)]',
};

const iconSizes: Record<ButtonSize, string> = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

// ─── Component ────────────────────────────────────────────────────────────────

const MotionButton = motion.create('button');

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      onClick,
      type = 'button',
      form,
      id,
      name,
      style,
      'aria-label': ariaLabel,
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <MotionButton
        ref={ref}
        type={type}
        form={form}
        id={id}
        name={name}
        style={style}
        aria-label={ariaLabel}
        disabled={isDisabled}
        onClick={onClick}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35, mass: 0.5 }}
        className={cn(
          'inline-flex items-center justify-center font-semibold',
          'transition-colors duration-150',
          'select-none cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'relative opacity-80',
          className
        )}
      >
        {loading && (
          <Loader2
            className={cn(iconSizes[size], 'animate-spin shrink-0')}
            aria-hidden
          />
        )}

        {!loading && leadingIcon && (
          <span className={cn(iconSizes[size], 'shrink-0')} aria-hidden>
            {leadingIcon}
          </span>
        )}

        <span className={cn(loading && 'opacity-70')}>{children}</span>

        {!loading && trailingIcon && (
          <span className={cn(iconSizes[size], 'shrink-0')} aria-hidden>
            {trailingIcon}
          </span>
        )}
      </MotionButton>
    );
  }
);

Button.displayName = 'Button';
