// src/lib/supabase/organizations.ts
import { requireSupabase } from './client';
import type { Organization } from '@/types/supabase';

const TABLE = 'organizations';

// ─── Obtener todas ────────────────────────────────────────────────
export async function fetchOrganizations(): Promise<Organization[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Organization[];
}

// ─── Obtener una por ID ───────────────────────────────────────────
export async function fetchOrganizationById(id: string): Promise<Organization> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Organization;
}

// ─── Crear ─────────────────────────────────────────────────────────
export async function createOrganization(
  payload: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
): Promise<Organization> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Organization;
}

// ─── Actualizar ────────────────────────────────────────────────────
export async function updateOrganization(
  id: string,
  changes: Partial<Omit<Organization, 'id' | 'created_at'>>
): Promise<Organization> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Organization;
}

// ─── Eliminar ──────────────────────────────────────────────────────
export async function deleteOrganization(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}