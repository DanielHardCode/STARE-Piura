import { create } from 'zustand';
import type { User } from '@/types/index';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'user-001',
    email: 'coordinador@starepiura.org',
    nombre: 'Coordinador STARE',
    role: 'admin',
    avatar_url: undefined,
    created_at: new Date('2026-01-01').toISOString(),
  },
  loading: false,
  error: null,

  login: async (email: string) => {
    set({ loading: true, error: null });
    try {
      // Simulación de delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      set({
        user: {
          id: 'user-001',
          email,
          nombre: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'coordinador',
          created_at: new Date().toISOString(),
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Error al iniciar sesión', loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ user: null, loading: false });
  },
}));
