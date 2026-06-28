import { requireSupabase } from './client';
import type { Notification } from '@/types/supabase';

const TABLE = 'notifications';

export async function fetchNotifications(): Promise<Notification[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Notification[];
}

export async function fetchNotificationById(id: string): Promise<Notification> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Notification;
}

export async function createNotification(
  payload: Omit<Notification, 'id' | 'created_at'>
): Promise<Notification> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

export async function updateNotification(
  id: string,
  changes: Partial<Omit<Notification, 'id' | 'created_at'>>
): Promise<Notification> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .update(changes)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Notification;
}

export async function deleteNotification(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
}
