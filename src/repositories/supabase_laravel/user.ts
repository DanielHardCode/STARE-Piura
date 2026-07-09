/**
 * @file src/repositories/supabase_laravel/user.ts
 * @description Repositorio de Gestión de Usuarios para el provider `supabase_laravel`.
 * Requiere rol Admin. El backend crea el usuario tanto en Supabase Auth como
 * en la tabla de perfiles de manera atómica.
 *
 * Endpoints cubiertos:
 *  - GET  /api/users
 *  - GET  /api/users/{id}
 *  - POST /api/users/register
 *  - PUT  /api/users/{id}
 */

import { apiGet, apiPost, apiPut } from '@/lib/api-client';
import type { IUserRepository } from '../contracts/user';
import type { User, RegisterUserDTO, UpdateUserDTO } from '@/types/index';

export class SupabaseLaravelUserRepository implements IUserRepository {
  /**
   * Obtiene la lista completa de usuarios del sistema.
   * Solo accesible para usuarios con rol `admin`.
   */
  async getAll(): Promise<User[]> {
    return apiGet<User[]>('/api/users');
  }

  /**
   * Obtiene un usuario por su ID.
   * @param id UUID del usuario (también es el `auth.uid` de Supabase).
   * @returns El usuario o `null` si no existe (404).
   */
  async getById(id: string): Promise<User | null> {
    try {
      return await apiGet<User>(`/api/users/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * El backend de Laravel crea el usuario en Supabase Auth (Admin API)
   * y luego inserta el perfil en la tabla `profiles` de manera atómica.
   *
   * @param dto Datos del nuevo usuario incluyendo contraseña inicial.
   * @returns El perfil de usuario creado.
   */
  async register(dto: RegisterUserDTO): Promise<User> {
    return apiPost<User>('/api/users/register', dto);
  }

  /**
   * Actualiza los datos de perfil de un usuario.
   * Permite cambiar nombre, rol, teléfono y estado activo/inactivo.
   *
   * @param id  UUID del usuario.
   * @param dto Campos a actualizar.
   * @returns El usuario con los datos actualizados.
   */
  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    return apiPut<User>(`/api/users/${id}`, dto);
  }
}
