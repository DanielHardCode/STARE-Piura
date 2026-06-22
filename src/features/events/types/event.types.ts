/**
 * @file event.types.ts
 * @description Tipos e interfaces de la feature de Eventos Sociales.
 */
import { PiuraDistrict } from '../../../shared/types';

export interface BolsaItem {
  id: string;
  name: string;
  unit: string;
  targetQty: number;
  currentQty: number;
  /** Precio estimado por unidad en Soles peruanos (PEN). */
  unitPriceEstimate: number;
}

export type EventStatus = 'programado' | 'en_progreso' | 'completado' | 'cancelado';

export interface SocialEvent {
  id: string;
  title: string;
  description: string;
  /** Fecha en formato ISO (YYYY-MM-DD). */
  date: string;
  district: PiuraDistrict;
  targetAudience: string;
  status: EventStatus;
  itemsBolsa: BolsaItem[];
}
