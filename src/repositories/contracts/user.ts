import type { User, RegisterUserDTO, UpdateUserDTO } from '@/types/index';

/**
 * Contrato del repositorio de gestión de usuarios (requiere rol Admin).
 * Corresponde a los endpoints `/api/users`.
 */
export interface IUserRepository {
  /** GET /api/users */
  getAll(): Promise<User[]>;
  /** GET /api/users/{id} */
  getById(id: string): Promise<User | null>;
  /**
   * POST /api/users/register
   * Crea el usuario en Supabase Auth y en la tabla de perfiles de manera atómica
   * en el servidor de Laravel.
   */
  register(dto: RegisterUserDTO): Promise<User>;
  /** PUT /api/users/{id} */
  update(id: string, dto: UpdateUserDTO): Promise<User>;
}
