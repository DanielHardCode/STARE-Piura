import { requireSupabase } from './client';
import type { Donation } from '@/types/supabase';

const TABLE = 'donations';

export async function fetchDonations(): Promise<Donation[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Donation[];
}

export async function fetchDonationById(id: string): Promise<Donation> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Donation;
}

export async function createDonation(
  payload: Omit<Donation, 'id' | 'created_at'>
): Promise<Donation> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Donation;
}

export async function updateDonation(
  id: string,
  changes: Partial<Omit<Donation, 'id' | 'created_at'>>
): Promise<Donation> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Donation;
}

export async function deleteDonation(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
