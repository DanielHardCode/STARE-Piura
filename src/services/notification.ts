import { getRepositories } from '@/repositories';
import type { Notification } from '@/types/index';

export class NotificationService {
  private get repos() {
    return getRepositories();
  }

  async getNotifications(): Promise<Notification[]> {
    return this.repos.notifications.getAll();
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.repos.notifications.markAsRead(id);
  }

  async markAllAsRead(): Promise<void> {
    return this.repos.notifications.markAllAsRead();
  }
}

export const notificationService = new NotificationService();
