/**
 * @file src/components/ui/Skeleton.tsx
 * @description Componente Skeleton del design system de STARE Piura.
 * Variantes: line | circle | card | table-row | kpi-card
 * Animación shimmer CSS (GPU-accelerated, sin Framer Motion).
 * Los skeletons imitan el layout real de cada componente.
 */

import React from 'react';
import { cn } from '@/lib/utils';

// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton rounded-[var(--radius-md)]', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

// ─── Skeleton Line ────────────────────────────────────────────────────────────

export function SkeletonLine({
  width = '100%',
  className,
}: {
  width?: string;
  className?: string;
}) {
  return <Skeleton className={cn('h-4', className)} width={width} />;
}

// ─── Skeleton Circle ──────────────────────────────────────────────────────────

export function SkeletonCircle({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Skeleton
      className={cn('rounded-full shrink-0', className)}
      width={`${size}px`}
      height={`${size}px`}
    />
  );
}

// ─── KPI Card Skeleton ────────────────────────────────────────────────────────

export function KPICardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'p-5 bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
        'rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)]',
        'space-y-3',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonLine width="55%" className="h-3" />
          <SkeletonLine width="70%" className="h-7" />
          <SkeletonLine width="40%" className="h-3" />
        </div>
        <SkeletonCircle size={40} className="rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}

// ─── List Item Skeleton ───────────────────────────────────────────────────────

export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 p-4',
        'bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
        'rounded-[var(--radius-lg)]',
        className
      )}
      aria-hidden="true"
    >
      <SkeletonCircle size={40} />
      <div className="flex-1 space-y-2">
        <SkeletonLine width="60%" />
        <SkeletonLine width="40%" className="h-3" />
      </div>
      <SkeletonLine width="60px" className="h-6 rounded-full" />
    </div>
  );
}

// ─── Card Skeleton ────────────────────────────────────────────────────────────

export function CardSkeleton({ className, lines = 3 }: { className?: string; lines?: number }) {
  return (
    <div
      className={cn(
        'p-5 bg-[var(--color-bg-primary)] border border-[var(--color-border)]',
        'rounded-[var(--radius-xl)] shadow-[var(--shadow-sm)]',
        'space-y-3',
        className
      )}
      aria-hidden="true"
    >
      <div className="flex items-center gap-3 mb-4">
        <SkeletonCircle size={32} className="rounded-[var(--radius-md)]" />
        <SkeletonLine width="40%" className="h-4" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 ? '65%' : '100%'}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Table Row Skeleton ───────────────────────────────────────────────────────

export function TableRowSkeleton({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <tr className={cn('border-b border-[var(--color-border)]', className)} aria-hidden="true">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonLine width={i === 0 ? '80%' : i === columns - 1 ? '50%' : '70%'} />
        </td>
      ))}
    </tr>
  );
}

// ─── Grid of Skeletons ────────────────────────────────────────────────────────

export function SkeletonGrid({
  count = 6,
  SkeletonComponent = CardSkeleton,
  className,
}: {
  count?: number;
  SkeletonComponent?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
}
