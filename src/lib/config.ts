/**
 * @file src/lib/config.ts
 * @description Configuración global de la aplicación STARE Piura.
 * Lee las variables de entorno de Vite para determinar el provider de datos
 * y las credenciales de backend (Supabase + Laravel).
 *
 * Para cambiar de mock a backend real, solo modifica VITE_DATA_PROVIDER en .env
 */

/// <reference types="vite/client" />

export type DataProvider = 'mock' | 'supabase_laravel' | 'supabase';

export const config = {
  /** Proveedor de datos activo. Cambia solo la variable de entorno. */
  dataProvider: (import.meta.env['VITE_DATA_PROVIDER'] ?? 'mock') as DataProvider,

  /** Nombre de la aplicación */
  appName: (import.meta.env['VITE_APP_NAME'] ?? 'STARE Piura') as string,

  /** Versión de la aplicación */
  appVersion: (import.meta.env['VITE_APP_VERSION'] ?? '1.0.0') as string,

  /** Configuración de Supabase (usado solo en modo supabase_laravel) */
  supabase: {
    url: (import.meta.env['VITE_SUPABASE_URL'] ?? '') as string,
    anonKey: (import.meta.env['VITE_SUPABASE_ANON_KEY'] ?? '') as string,
  },

  /** URL base de la API Laravel (usado solo en modo supabase_laravel) */
  laravelApiUrl: (import.meta.env['VITE_LARAVEL_API_URL'] ?? '') as string,
} as const;

/** Verdadero cuando la app opera en modo completamente offline con datos mock */
export const isMockMode = config.dataProvider === 'mock';
