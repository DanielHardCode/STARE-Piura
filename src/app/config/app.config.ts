/**
 * @file app.config.ts
 * @description Configuración global de la aplicación STARE Piura.
 */

export const APP_CONFIG = {
  name: 'STARE Piura',
  fullName: 'Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social',
  version: '1.0.0',
  region: 'Piura, Perú',
  baseOperations: 'Prefectura Zonal de Piura',
  storageStrategy: 'offline-first' as const,
} as const;

/** Tipos de pantalla disponibles en la navegación principal. */
export type ActiveScreen =
  | 'dashboard'
  | 'captacion'
  | 'balance'
  | 'voluntario' // Se mantiene internamente pero se oculta del menú
  | 'organizaciones'
  | 'eventos'; // Nueva sección independiente
