/**
 * @file src/lib/utils.ts
 * @description Utilidades globales de STARE Piura.
 * Funciones puras de formato, composición de clases y helpers varios.
 */

// ─── Class Name Composition ──────────────────────────────────────────────────

/**
 * Composición de clases de Tailwind sin dependencia externa.
 * Filtra valores falsy y une las clases con un espacio.
 *
 * @example cn('base-class', condition && 'conditional', undefined) → 'base-class conditional'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ─── Currency Formatting ─────────────────────────────────────────────────────

/**
 * Formatea un número como moneda Peruana (PEN / Soles).
 *
 * @example formatCurrency(1480.5) → 'S/. 1,480.50'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea un número como moneda compacta para KPIs (miles/millones).
 *
 * @example formatCurrencyCompact(1480000) → 'S/. 1.48M'
 */
export function formatCurrencyCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `S/. ${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `S/. ${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// ─── Date Formatting (UTC-5 Perú) ────────────────────────────────────────────

/**
 * Zona horaria de Perú.
 */
const PERU_TIMEZONE = 'America/Lima';

/**
 * Formatea una fecha en el formato largo localizado (español Perú).
 *
 * @example formatDate('2026-06-15') → '15 de junio de 2026'
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: PERU_TIMEZONE,
  }).format(d);
}

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY).
 *
 * @example formatDateShort('2026-06-15') → '15/06/2026'
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: PERU_TIMEZONE,
  }).format(d);
}

/**
 * Formatea una fecha en tiempo relativo al momento actual.
 *
 * @example formatRelativeTime(new Date()) → 'hace 2 minutos'
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat('es-PE', { numeric: 'auto' });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 30) return rtf.format(-diffDay, 'day');
  return formatDate(d);
}

// ─── Percentage ───────────────────────────────────────────────────────────────

/**
 * Calcula un porcentaje y lo devuelve clampado entre 0 y 100.
 */
export function calcPct(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * Formatea un número como porcentaje.
 *
 * @example formatPct(0.734) → '73.4%'
 */
export function formatPct(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── ID Generation ────────────────────────────────────────────────────────────

/**
 * Genera un ID único simple con prefijo.
 * Para producción usar nanoid o UUID.
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Color by Status ─────────────────────────────────────────────────────────

export type EventStatus = 'programada' | 'en_curso' | 'realizada' | 'cancelada';

/**
 * Devuelve las clases de color semánticas para un estado de evento.
 */
export function getStatusColor(status: EventStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  const map: Record<EventStatus, ReturnType<typeof getStatusColor>> = {
    programada: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    en_curso: {
      bg: 'bg-teal-50',
      text: 'text-teal-700',
      border: 'border-teal-200',
      dot: 'bg-teal-500',
    },
    realizada: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      dot: 'bg-green-500',
    },
    cancelada: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-400',
    },
  };
  return map[status];
}
