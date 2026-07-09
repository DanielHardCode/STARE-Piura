import { create } from 'zustand';
import type { User, UserRole } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { isMockMode } from '@/lib/config';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Inicialmente nulo para que arranque en la pantalla de Login
  loading: false,
  error: null,
  initialized: false,

  initializeAuth: async () => {
    if (isMockMode) {
      // En modo mock, inicializamos de inmediato
      set({ initialized: true });
      return;
    }

    const client = supabase;
    if (!client) {
      set({ initialized: true });
      return;
    }

    try {
      // 1. Obtener sesión activa
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        let role: UserRole = 'coordinador';
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profile?.role) {
            role = profile.role as UserRole;
          }
        } catch {}

        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            nombre: session.user.user_metadata['nombre'] || session.user.email?.split('@')[0] || 'Usuario',
            role,
            activo: true,
            avatar_url: session.user.user_metadata['avatar_url'],
            created_at: session.user.created_at,
          },
        });
      }
    } catch (err) {
      console.error('Error al inicializar sesión:', err);
    } finally {
      set({ initialized: true });
    }

    // 2. Suscribirse a cambios de estado de autenticación
    client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        let role: UserRole = 'coordinador';
        try {
          const { data: profile } = await client
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          if (profile?.role) {
            role = profile.role as UserRole;
          }
        } catch {}

        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            nombre: session.user.user_metadata['nombre'] || session.user.email?.split('@')[0] || 'Usuario',
            role,
            activo: true,
            avatar_url: session.user.user_metadata['avatar_url'],
            created_at: session.user.created_at,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      if (isMockMode) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Permitimos login en modo mock de acuerdo al correo
        const role: UserRole = email.includes('admin') ? 'admin' : email.includes('voluntario') ? 'voluntario' : 'coordinador';
        set({
          user: {
            id: 'mock-user-id',
            email,
            nombre: email.split('@')[0].toUpperCase(),
            role,
            activo: true,
            created_at: new Date().toISOString(),
          },
          loading: false,
        });
        return;
      }

      if (!supabase) {
        throw new Error('Supabase no está configurado en las variables de entorno.');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (error) throw error;
      // El listener de onAuthStateChange actualizará el estado del usuario.
    } catch (err: any) {
      set({ error: err.message || 'Error al iniciar sesión', loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      if (isMockMode) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        set({ user: null, loading: false });
        return;
      }

      if (supabase) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      }
      set({ user: null, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al cerrar sesión', loading: false });
      throw err;
    }
  },
}));
