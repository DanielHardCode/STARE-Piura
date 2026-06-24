import { create } from 'zustand';
import type { Notification } from '@/types/index';
import { notificationService } from '@/services/notification';
import { supabase } from '@/lib/supabase';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setupRealtimeListener: () => () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async () => {
    set({ loading: true, error: null });
    try {
      const data = await notificationService.getNotifications();
      const unread = data.filter((x) => !x.read).length;
      set({ notifications: data, unreadCount: unread, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener notificaciones', loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      const updated = await notificationService.markAsRead(id);
      set((state) => {
        const list = state.notifications.map((x) => (x.id === id ? updated : x));
        return {
          notifications: list,
          unreadCount: list.filter((x) => !x.read).length,
        };
      });
    } catch (err: any) {
      set({ error: err.message || 'Error al marcar como leída' });
    }
  },

  markAllAsRead: async () => {
    set({ loading: true, error: null });
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((x) => ({ ...x, read: true })),
        unreadCount: 0,
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Error al marcar todas como leídas', loading: false });
    }
  },

  setupRealtimeListener: () => {
    if (!supabase) {
      // Retornar no-op si Supabase no está configurado (modo mock local)
      return () => {};
    }

    const channel = supabase
      .channel('realtime-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNot = payload.new as Notification;
          set((state) => {
            if (state.notifications.some((n) => n.id === newNot.id)) {
              return state;
            }
            const updatedList = [newNot, ...state.notifications];
            return {
              notifications: updatedList,
              unreadCount: updatedList.filter((x) => !x.read).length,
            };
          });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  },
}));
