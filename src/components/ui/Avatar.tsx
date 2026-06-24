/**
 * @file src/components/ui/Avatar.tsx
 * @description Componente Avatar del design system de STARE Piura.
 * Genera iniciales automáticamente si no hay imagen.
 * Tamaños: sm | md | lg | xl
 * Soporta: imagen con fallback, indicador de estado online
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

const sizeStyles: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  xs: { container: 'w-6 h-6',   text: 'text-[9px]',  indicator: 'w-1.5 h-1.5 border' },
  sm: { container: 'w-8 h-8',   text: 'text-[10px]', indicator: 'w-2 h-2 border' },
  md: { container: 'w-10 h-10', text: 'text-xs',      indicator: 'w-2.5 h-2.5 border-2' },
  lg: { container: 'w-12 h-12', text: 'text-sm',      indicator: 'w-3 h-3 border-2' },
  xl: { container: 'w-16 h-16', text: 'text-lg',      indicator: 'w-3.5 h-3.5 border-2' },
};

/** Paleta de colores determinista basada en las iniciales */
const avatarColors = [
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-pink-100 text-pink-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-indigo-100 text-indigo-700',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % avatarColors.length;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Avatar({
  name = 'Usuario',
  src,
  size = 'md',
  online,
  className,
}: AvatarProps) {
  const { container, text, indicator } = sizeStyles[size];
  const initials = getInitials(name);
  const colorClass = avatarColors[getColorIndex(name)];
  const [imgError, setImgError] = React.useState(false);
  const showImage = src && !imgError;

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          container,
          'rounded-full overflow-hidden',
          'flex items-center justify-center',
          'font-bold select-none',
          !showImage && colorClass
        )}
        title={name}
        aria-label={name}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={text}>{initials}</span>
        )}
      </div>

      {/* Online indicator */}
      {online !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full',
            'border-white',
            indicator,
            online ? 'bg-green-500' : 'bg-slate-300'
          )}
          aria-label={online ? 'En línea' : 'Desconectado'}
        />
      )}
    </div>
  );
}

// ─── Avatar Group ─────────────────────────────────────────────────────────────

interface AvatarGroupProps {
  avatars: { name: string; src?: string }[];
  max?: number;
  size?: AvatarSize;
  className?: string;
}

export function AvatarGroup({
  avatars,
  max = 4,
  size = 'sm',
  className,
}: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;
  const { container, text } = sizeStyles[size];

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((av, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={av.name} src={av.src} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className={cn(
            container,
            'rounded-full ring-2 ring-white',
            'bg-slate-100 text-slate-600',
            'flex items-center justify-center font-bold',
            text
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
