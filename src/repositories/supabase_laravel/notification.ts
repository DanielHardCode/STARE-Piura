/**
 * @file src/repositories/supabase_laravel/notification.ts
 * @description Repositorio de Notificaciones para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET  /api/notifications
 *  - PUT  /api/notifications/{id}/read
 *  - POST /api/notifications/read-all
 *  - POST /api/notifications           (creación interna del sistema)
 */

import { apiGet, apiPost, apiPut } from '@/lib/api-client';
import type { INotificationRepository } from '../contracts/notification';
import type { Notification, NotificationType } from '@/types/index';

export class SupabaseLaravelNotificationRepository implements INotificationRepository {
  /**
   * Obtiene las notificaciones del usuario autenticado.
   * El backend las retorna ordenadas por fecha de creación descendente.
   */
  async getAll(): Promise<Notification[]> {
    return apiGet<Notification[]>('/api/notifications');
  }

  /**
   * Marca una notificación específica como leída.
   * @param id UUID de la notificación.
   * @returns La notificación actualizada con `read: true`.
   */
  async markAsRead(id: string): Promise<Notification> {
    return apiPut<Notification>(`/api/notifications/${id}/read`);
  }

  /**
   * Marca todas las notificaciones del usuario como leídas.
   */
  async markAllAsRead(): Promise<void> {
    await apiPost('/api/notifications/read-all');
  }

  /**
   * Crea una notificación del sistema.
   * Usado internamente por otros servicios (EventService, FinanceService, etc.)
   * para generar alertas automáticas.
   *
   * @param tipo    Tipo de notificación del dominio.
   * @param title   Título corto de la notificación.
   * @param message Mensaje descriptivo de la notificación.
   * @returns La notificación creada.
   */
  async create(tipo: NotificationType, title: string, message: string): Promise<Notification> {
    return apiPost<Notification>('/api/notifications', { tipo, title, message });
  }
}
