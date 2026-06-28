import { requireSupabase } from './client';
import type { Donor } from '@/types/supabase';

const TABLE = 'donors';

export async function fetchDonors(): Promise<Donor[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Donor[];
}

export async function fetchDonorById(id: string): Promise<Donor> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Donor;
}

export async function createDonor(
  payload: Omit<Donor, 'id' | 'created_at'>
): Promise<Donor> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Donor;
}

export async function updateDonor(
  id: string,
  changes: Partial<Omit<Donor, 'id' | 'created_at'>>
): Promise<Donor> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Donor;
}

export async function deleteDonor(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
