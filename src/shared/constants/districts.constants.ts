/**
 * @file districts.constants.ts
 * @description Lista de distritos de Piura disponibles para uso en formularios,
 * filtros y validaciones de toda la aplicación.
 */
import { PiuraDistrict } from '../types';

export const PIURA_DISTRICTS: PiuraDistrict[] = [
  'Piura Centro',
  'Catacaos',
  'Castilla',
  'Veintiséis de Octubre',
  'Sullana',
  'Chulucanas',
  'Sechura',
  'Paita',
  'Talara',
  'Tambogrande',
];

/** Clave base usada para los ítems de localStorage de STARE. */
export const STORAGE_KEY_PREFIX = 'stare_';

/** Fecha simulada de "hoy" para el sistema (sin backend de fecha). */
export const SIMULATED_TODAY = '2026-06-03';
