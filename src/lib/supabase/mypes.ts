import { requireSupabase } from './client';
import type { Mype } from '@/types/supabase';

const TABLE = 'mypes';

export async function fetchMypes(): Promise<Mype[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Mype[];
}

export async function fetchMypeById(id: string): Promise<Mype> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Mype;
}

export async function createMype(
  payload: Omit<Mype, 'id' | 'created_at'>
): Promise<Mype> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Mype;
}

export async function updateMype(
  id: string,
  changes: Partial<Omit<Mype, 'id' | 'created_at'>>
): Promise<Mype> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Mype;
}

export async function deleteMype(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
