import { requireSupabase } from './client';
import type { Event } from '@/types/supabase';

const TABLE = 'events';

export async function fetchEvents(): Promise<Event[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Event[];
}

export async function fetchEventById(id: string): Promise<Event> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Event;
}

export async function createEvent(
  payload: Omit<Event, 'id' | 'created_at' | 'updated_at'>
): Promise<Event> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

export async function updateEvent(
  id: string,
  changes: Partial<Omit<Event, 'id' | 'created_at'>>
): Promise<Event> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Event;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
