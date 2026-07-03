// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/config';

export const supabase = config.supabase.url && config.supabase.anonKey
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : null;

export const isSupabaseConfigured = (): boolean => !!supabase;

/** Lanza un error si el cliente no está configurado, útil dentro de las funciones */
export const requireSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase no está configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }
  return supabase;
};