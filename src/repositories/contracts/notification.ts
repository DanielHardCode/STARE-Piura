import type { Notification } from '@/types/index';

export interface INotificationRepository {
  getAll(): Promise<Notification[]>;
  markAsRead(id: string): Promise<Notification>;
  markAllAsRead(): Promise<void>;
  create(tipo: string, title: string, message: string): Promise<Notification>;
}
