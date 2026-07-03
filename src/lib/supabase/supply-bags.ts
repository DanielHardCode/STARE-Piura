import { requireSupabase } from './client';
import type { SupplyBag } from '@/types/supabase';

const TABLE = 'supply_bags';

export async function fetchSupplyBags(): Promise<SupplyBag[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SupplyBag[];
}

export async function fetchSupplyBagById(id: string): Promise<SupplyBag> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SupplyBag;
}

export async function createSupplyBag(
  payload: Omit<SupplyBag, 'id' | 'created_at' | 'updated_at'>
): Promise<SupplyBag> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as SupplyBag;
}

export async function updateSupplyBag(
  id: string,
  changes: Partial<Omit<SupplyBag, 'id' | 'created_at'>>
): Promise<SupplyBag> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SupplyBag;
}

export async function deleteSupplyBag(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
