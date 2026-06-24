/**
 * @file src/components/ui/Input.tsx
 * @description Componente Input del design system de STARE Piura.
 * Soporta: label, helper text, error message, iconos leading/trailing.
 * Compatible con React Hook Form mediante forwardRef.
 * Estados: default | focus | error | disabled
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  containerClassName?: string;
  required?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  required?: boolean;
  rows?: number;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

// ─── Base Input styles ────────────────────────────────────────────────────────

const baseInputClass = [
  'w-full h-10 px-3.5',
  'bg-[var(--color-bg-primary)]',
  'border border-[var(--color-border)]',
  'rounded-[var(--radius-lg)]',
  'text-sm text-[var(--color-text-primary)]',
  'placeholder:text-[var(--color-text-tertiary)]',
  'outline-none',
  'transition-all duration-150',
  // Focus
  'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
  // Disabled
  'disabled:bg-[var(--color-bg-secondary)] disabled:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed',
].join(' ');

const errorInputClass = 'border-red-400 focus:border-red-500 focus:ring-red-500/20';

// ─── Label ────────────────────────────────────────────────────────────────────

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

// ─── Helper / Error Text ──────────────────────────────────────────────────────

function HelperText({ text, isError }: { text: string; isError?: boolean }) {
  return (
    <p
      className={cn(
        'mt-1.5 text-xs',
        isError ? 'text-red-500 font-medium' : 'text-[var(--color-text-tertiary)]'
      )}
    >
      {text}
    </p>
  );
}

// ─── Input Component ──────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leadingIcon,
      trailingIcon,
      containerClassName,
      required,
      id,
      className,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative">
          {/* Leading icon */}
          {leadingIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              baseInputClass,
              hasError ? errorInputClass : undefined,
              leadingIcon ? 'pl-9' : undefined,
              trailingIcon ? 'pr-9' : undefined,
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Trailing icon */}
          {trailingIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] pointer-events-none">
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Error message */}
        {hasError && (
          <HelperText
            text={error}
            isError
          />
        )}

        {/* Helper text */}
        {!hasError && helperText && (
          <HelperText text={helperText} />
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── Textarea Component ───────────────────────────────────────────────────────

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, containerClassName, required, id, rows = 3, className, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          required={required}
          className={cn(
            'w-full px-3.5 py-2.5',
            'bg-[var(--color-bg-primary)]',
            'border border-[var(--color-border)]',
            'rounded-[var(--radius-lg)]',
            'text-sm text-[var(--color-text-primary)]',
            'placeholder:text-[var(--color-text-tertiary)]',
            'outline-none resize-vertical',
            'transition-all duration-150',
            'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
            'disabled:bg-[var(--color-bg-secondary)] disabled:cursor-not-allowed',
            hasError && errorInputClass,
            className
          )}
          aria-invalid={hasError}
          {...props}
        />
        {hasError && <HelperText text={error} isError />}
        {!hasError && helperText && <HelperText text={helperText} />}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ─── Select Component ─────────────────────────────────────────────────────────

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, containerClassName, required, id, options, placeholder, className, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={inputId}
          required={required}
          className={cn(
            baseInputClass,
            'appearance-none cursor-pointer pr-8',
            'bg-[image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%2394a3b8\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z\' clip-rule=\'evenodd\'/%3E%3C/svg%3E")]',
            'bg-no-repeat bg-[right_0.5rem_center] bg-[length:1.25rem]',
            hasError && errorInputClass,
            className
          )}
          aria-invalid={hasError}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasError && <HelperText text={error} isError />}
        {!hasError && helperText && <HelperText text={helperText} />}
      </div>
    );
  }
);

Select.displayName = 'Select';
