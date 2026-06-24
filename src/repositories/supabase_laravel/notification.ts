import type { INotificationRepository } from '../contracts/notification';
import type { Notification, NotificationType } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelNotificationRepository implements INotificationRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<Notification[]> {
    const { data, error } = await this.client
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener notificaciones de Supabase: ${error.message}`);
    }

    return (data || []) as Notification[];
  }

  async markAsRead(id: string): Promise<Notification> {
    return laravelApi.put<Notification>(`/notifications/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await laravelApi.post('/notifications/read-all');
  }

  async create(tipo: NotificationType, title: string, message: string): Promise<Notification> {
    return laravelApi.post<Notification>('/notifications', {
      tipo,
      title,
      message,
    });
  }
}
