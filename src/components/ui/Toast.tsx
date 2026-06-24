/**
 * @file src/components/ui/Toast.tsx
 * @description Sistema de Toast/Notificaciones del design system de STARE Piura.
 * Variantes: success | error | warning | info
 * Posición: top-right (desktop), top-center (mobile)
 * Animación: slide + spring desde la derecha con Framer Motion AnimatePresence.
 *
 * Uso:
 *   1. Envuelve tu app con <ToastProvider>
 *   2. Usa el hook useToast() para disparar notificaciones
 *
 * @example
 *   const toast = useToast();
 *   toast.success('Donación registrada correctamente');
 *   toast.error('Error al conectar con el servidor');
 */

import React, { createContext, useContext, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toastVariants } from '@/animations/variants';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number; // ms, 0 = permanente
}

interface ToastContextValue {
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; iconClass: string; containerClass: string; progressClass: string }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-500',
    containerClass: 'bg-[var(--color-bg-elevated)] border-l-4 border-l-green-500',
    progressClass: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-red-500',
    containerClass: 'bg-[var(--color-bg-elevated)] border-l-4 border-l-red-500',
    progressClass: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    containerClass: 'bg-[var(--color-bg-elevated)] border-l-4 border-l-amber-500',
    progressClass: 'bg-amber-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    containerClass: 'bg-[var(--color-bg-elevated)] border-l-4 border-l-blue-500',
    progressClass: 'bg-blue-500',
  },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  const { icon: Icon, iconClass, containerClass, progressClass } = variantConfig[toast.variant];
  const duration = toast.duration ?? 4500;

  React.useEffect(() => {
    if (duration === 0) return;
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        'relative flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)]',
        'p-4 rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]',
        'border border-[var(--color-border)]',
        containerClass
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconClass)} aria-hidden />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">
          {toast.title}
        </p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className={cn(
          'shrink-0 text-[var(--color-text-tertiary)]',
          'hover:text-[var(--color-text-secondary)]',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-teal-500 rounded'
        )}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      {duration > 0 && (
        <motion.div
          className={cn('absolute bottom-0 left-0 h-0.5 rounded-full', progressClass)}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (variant: ToastVariant, title: string, description?: string, duration?: number) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
      setToasts((prev) => [...prev.slice(-4), { id, variant, title, description, duration }]);
    },
    []
  );

  const ctx: ToastContextValue = {
    success: (t, d) => add('success', t, d),
    error:   (t, d) => add('error', t, d),
    warning: (t, d) => add('warning', t, d),
    info:    (t, d) => add('info', t, d),
    dismiss,
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}

      {/* Toast Container */}
      <div
        className={cn(
          'fixed z-[var(--z-toast)]',
          'top-4 right-4',
          'flex flex-col gap-2 items-end',
          'sm:top-6 sm:right-6',
          // Mobile: centrado
          'max-sm:right-1/2 max-sm:translate-x-1/2 max-sm:items-center'
        )}
        aria-label="Notificaciones"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
