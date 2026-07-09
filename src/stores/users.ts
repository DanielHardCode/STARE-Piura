/**
 * @file src/stores/users.ts
 * @description Store Zustand para la gestión de usuarios del sistema (rol Admin).
 *
 * Acciones disponibles:
 *  - fetchUsers    — Carga todos los usuarios desde el backend.
 *  - fetchUserById — Carga un usuario específico.
 *  - registerUser  — Registra un nuevo usuario (Auth + DB atómico vía Laravel).
 *  - updateUser    — Actualiza perfil o estado activo/inactivo de un usuario.
 */

import { create } from 'zustand';
import type { User, RegisterUserDTO, UpdateUserDTO } from '@/types/index';
import { getRepositories } from '@/repositories';

interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;

  /** Carga la lista completa de usuarios. Requiere rol admin. */
  fetchUsers: () => Promise<void>;

  /** Carga un usuario por ID y lo guarda en `selectedUser`. */
  fetchUserById: (id: string) => Promise<User | null>;

  /**
   * Registra un nuevo usuario en el sistema.
   * El backend crea el usuario en Supabase Auth y en la BD de forma atómica.
   */
  registerUser: (dto: RegisterUserDTO) => Promise<User>;

  /** Actualiza nombre, rol, teléfono o estado activo/inactivo de un usuario. */
  updateUser: (id: string, dto: UpdateUserDTO) => Promise<User>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRepositories().users.getAll();
      set({ users: data, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener usuarios';
      set({ error: message, loading: false });
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await getRepositories().users.getById(id);
      set({ selectedUser: data, loading: false });
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener usuario';
      set({ error: message, loading: false });
      return null;
    }
  },

  registerUser: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newUser = await getRepositories().users.register(dto);
      set((state) => ({
        users: [...state.users, newUser],
        loading: false,
      }));
      return newUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrar usuario';
      set({ error: message, loading: false });
      throw err;
    }
  },

  updateUser: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await getRepositories().users.update(id, dto);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        loading: false,
      }));
      return updatedUser;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar usuario';
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
