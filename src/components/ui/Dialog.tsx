/**
 * @file src/components/ui/Dialog.tsx
 * @description Componente Dialog/Modal del design system de STARE Piura.
 * Desktop: modal centrado con overlay blur y spring scale.
 * Mobile: bottom sheet con drag-to-close.
 * Usa Framer Motion AnimatePresence para entradas/salidas suaves.
 */

import React, { useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  overlayVariants,
  modalVariants,
  bottomSheetVariants,
} from '@/animations/variants';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: DialogSize;
  /** Si true, fuerza bottom sheet en todos los tamaños */
  forceSheet?: boolean;
  /** Si true, no muestra el botón de cierre ni permite cerrar al hacer click en overlay */
  persistent?: boolean;
  className?: string;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const sizeStyles: Record<DialogSize, string> = {
  sm:   'max-w-sm',
  md:   'max-w-md',
  lg:   'max-w-lg',
  xl:   'max-w-2xl',
  full: 'max-w-5xl',
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  forceSheet = false,
  persistent = false,
  className,
}: DialogProps) {
  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !persistent) onClose();
    },
    [onClose, persistent]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="dialog-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'fixed inset-0 z-[var(--z-overlay)]',
              'bg-[var(--color-bg-overlay)]',
              'backdrop-blur-sm'
            )}
            onClick={persistent ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Dialog / Bottom Sheet */}
          <div
            className={cn(
              'fixed z-[var(--z-modal)]',
              forceSheet
                ? 'inset-x-0 bottom-0'
                : 'inset-0 flex items-center justify-center p-4 max-sm:items-end max-sm:p-0'
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            aria-describedby={description ? 'dialog-description' : undefined}
          >
            <motion.div
              key="dialog-panel"
              variants={forceSheet ? bottomSheetVariants : undefined}
              initial={
                !forceSheet
                  ? { opacity: 0, scale: 0.95, y: 8 }
                  : 'initial'
              }
              animate={
                !forceSheet
                  ? { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24 } }
                  : 'animate'
              }
              exit={
                !forceSheet
                  ? { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } }
                  : 'exit'
              }
              className={cn(
                'w-full bg-[var(--color-bg-elevated)]',
                'shadow-[var(--shadow-xl)]',
                'flex flex-col max-h-[90dvh]',
                forceSheet
                  ? 'rounded-t-[var(--radius-2xl)]'
                  : cn('rounded-[var(--radius-2xl)]', sizeStyles[size]),
                // Mobile: actuar como bottom sheet
                !forceSheet && 'max-sm:rounded-t-[var(--radius-2xl)] max-sm:rounded-b-none',
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar (mobile / forceSheet) */}
              {(forceSheet) && (
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 bg-[var(--color-border-strong)] rounded-full" />
                </div>
              )}
              <div className="flex justify-center pt-3 pb-1 flex-shrink-0 sm:hidden">
                <div className="w-10 h-1 bg-[var(--color-border-strong)] rounded-full" />
              </div>

              {/* Header */}
              {(title || !persistent) && (
                <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-4 border-b border-[var(--color-border)] flex-shrink-0">
                  <div>
                    {title && (
                      <h2
                        id="dialog-title"
                        className="text-base font-semibold text-[var(--color-text-primary)] leading-snug"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="dialog-description"
                        className="mt-1 text-sm text-[var(--color-text-secondary)]"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  {!persistent && (
                    <button
                      onClick={onClose}
                      className={cn(
                        'shrink-0 w-8 h-8 flex items-center justify-center',
                        'rounded-full text-[var(--color-text-tertiary)]',
                        'hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
                        'transition-colors duration-150',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500'
                      )}
                      aria-label="Cerrar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-[var(--color-border)] flex-shrink-0 flex items-center justify-end gap-3 flex-wrap">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-[var(--radius-lg)]',
              'text-[var(--color-text-secondary)]',
              'hover:bg-[var(--color-bg-secondary)]',
              'transition-colors duration-150',
              'disabled:opacity-50'
            )}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-[var(--radius-lg)]',
              'transition-colors duration-150',
              'disabled:opacity-50',
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            )}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </button>
        </>
      }
    >
      {null}
    </Dialog>
  );
}
