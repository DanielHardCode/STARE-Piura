import { createClient } from '@supabase/supabase-js';
import { config } from './config';

/**
 * Cliente de Supabase configurado con la URL y la llave anónima de las variables de entorno.
 * Si las variables no están configuradas, se creará un cliente ficticio o devolverá nulo
 * para evitar romper el inicio de la aplicación en modo desarrollo.
 */
export const supabase = config.supabase.url && config.supabase.anonKey
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null;

/**
 * Helper para verificar si la integración con Supabase está activa y configurada.
 */
export const isSupabaseConfigured = (): boolean => {
  return !!supabase;
};
