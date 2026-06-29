import type { INotificationRepository } from '../contracts/notification';
import type { Notification, NotificationType } from '@/types/index';
import { requireSupabase } from '@/lib/supabase/client';

export class SupabaseNotificationRepository implements INotificationRepository {
  async getAll(): Promise<Notification[]> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as Notification[];
  }

  async markAsRead(id: string): Promise<Notification> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }

  async markAllAsRead(): Promise<void> {
    const supabase = requireSupabase();
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .neq('read', true);

    if (error) throw error;
  }

  async create(tipo: NotificationType, title: string, message: string): Promise<Notification> {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from('notifications')
      .insert({ tipo, title, message, read: false })
      .select()
      .single();

    if (error) throw error;
    return data as Notification;
  }
}
