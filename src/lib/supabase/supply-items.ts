import { requireSupabase } from './client';
import type { SupplyItem } from '@/types/supabase';

const TABLE = 'supply_items';

export async function fetchSupplyItems(): Promise<SupplyItem[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as SupplyItem[];
}

export async function fetchSupplyItemById(id: string): Promise<SupplyItem> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as SupplyItem;
}

export async function createSupplyItem(
  payload: Omit<SupplyItem, 'id' | 'created_at'>
): Promise<SupplyItem> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as SupplyItem;
}

export async function updateSupplyItem(
  id: string,
  changes: Partial<Omit<SupplyItem, 'id' | 'created_at'>>
): Promise<SupplyItem> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SupplyItem;
}

export async function deleteSupplyItem(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
