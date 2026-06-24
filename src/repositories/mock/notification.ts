import type { INotificationRepository } from '../contracts/notification';
import type { Notification, NotificationType } from '@/types/index';
import { MOCK_NOTIFICATIONS } from '@/mocks';
import { delay } from './utils';

export class MockNotificationRepository implements INotificationRepository {
  private static items: Notification[] = [...MOCK_NOTIFICATIONS];

  async getAll(): Promise<Notification[]> {
    await delay();
    return [...MockNotificationRepository.items];
  }

  async markAsRead(id: string): Promise<Notification> {
    await delay();
    const idx = MockNotificationRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Notificación con id ${id} no encontrada`);
    }
    MockNotificationRepository.items[idx] = {
      ...MockNotificationRepository.items[idx],
      read: true,
    };
    return { ...MockNotificationRepository.items[idx] };
  }

  async markAllAsRead(): Promise<void> {
    await delay();
    MockNotificationRepository.items = MockNotificationRepository.items.map((x) => ({
      ...x,
      read: true,
    }));
  }

  async create(tipo: NotificationType, title: string, message: string): Promise<Notification> {
    await delay();
    const id = `notif-${String(MockNotificationRepository.items.length + 1).padStart(3, '0')}`;
    const newItem: Notification = {
      id,
      tipo,
      title,
      message,
      read: false,
      created_at: new Date().toISOString(),
    };
    MockNotificationRepository.items.unshift(newItem); // Nuevas notificaciones al inicio
    return { ...newItem };
  }
}
