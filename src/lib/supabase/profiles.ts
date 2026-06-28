import { requireSupabase } from './client';
import type { Profile } from '@/types/supabase';

const TABLE = 'profiles';

export async function fetchProfiles(): Promise<Profile[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

export async function fetchProfileById(id: string): Promise<Profile> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function createProfile(
  payload: Omit<Profile, 'id' | 'created_at'>
): Promise<Profile> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(
  id: string,
  changes: Partial<Omit<Profile, 'id' | 'created_at'>>
): Promise<Profile> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function deleteProfile(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
