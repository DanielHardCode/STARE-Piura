/**
 * @file src/hooks/useUsers.ts
 * @description Hook React para la gestión de usuarios del sistema (rol Admin).
 *
 * Conecta el componente con `useUserStore` y provee acciones tipadas.
 * Carga los usuarios automáticamente al montar si el store está vacío.
 *
 * @example
 * ```tsx
 * const { users, isLoading, registerUser, updateUser, toggleUserStatus } = useUsers();
 * ```
 */

import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/stores/users';
import type { RegisterUserDTO, UpdateUserDTO } from '@/types/index';

/**
 * Hook para gestión de usuarios (CRUD).
 *
 * @returns Objeto con el estado y las acciones para gestionar usuarios.
 *
 * | Campo             | Descripción                                      |
 * |-------------------|--------------------------------------------------|
 * | `users`           | Lista de todos los usuarios del sistema.         |
 * | `selectedUser`    | Usuario actualmente seleccionado.                |
 * | `isLoading`       | `true` mientras hay una operación en curso.      |
 * | `error`           | Mensaje de error de la última operación fallida. |
 * | `fetchUsers`      | Recarga la lista de usuarios desde el backend.   |
 * | `registerUser`    | Registra un nuevo usuario (Auth + DB atómico).   |
 * | `updateUser`      | Actualiza datos de un usuario existente.         |
 * | `toggleUserStatus`| Activa o desactiva un usuario.                   |
 */
export function useUsers() {
  const {
    users,
    selectedUser,
    loading: isLoading,
    error,
    fetchUsers,
    registerUser: storeRegisterUser,
    updateUser: storeUpdateUser,
  } = useUserStore();

  // Carga inicial si el store está vacío
  useEffect(() => {
    if (users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users.length]);

  /**
   * Registra un nuevo usuario en el sistema.
   * El backend crea el usuario en Supabase Auth y en la BD de forma atómica.
   *
   * @param dto Datos del nuevo usuario incluyendo email, contraseña y rol.
   */
  const registerUser = useCallback(
    (dto: RegisterUserDTO) => storeRegisterUser(dto),
    [storeRegisterUser]
  );

  /**
   * Actualiza los datos de perfil de un usuario.
   *
   * @param id  UUID del usuario.
   * @param dto Campos a actualizar.
   */
  const updateUser = useCallback(
    (id: string, dto: UpdateUserDTO) => storeUpdateUser(id, dto),
    [storeUpdateUser]
  );

  /**
   * Activa o desactiva un usuario.
   * Helper de conveniencia sobre `updateUser`.
   *
   * @param id            UUID del usuario.
   * @param currentStatus Estado actual de `activo`.
   */
  const toggleUserStatus = useCallback(
    (id: string, currentStatus: boolean) =>
      storeUpdateUser(id, { activo: !currentStatus }),
    [storeUpdateUser]
  );

  return {
    users,
    selectedUser,
    isLoading,
    error,
    fetchUsers,
    registerUser,
    updateUser,
    toggleUserStatus,
  };
}
