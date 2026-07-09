/**
 * @file src/repositories/supabase_laravel/mype.ts
 * @description Repositorio de MYPEs para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET    /api/mypes
 *  - POST   /api/mypes
 *  - PUT    /api/mypes/{id}
 *  - DELETE /api/mypes/{id}
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type { IMypeRepository } from '../contracts/mype';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';

export class SupabaseLaravelMypeRepository implements IMypeRepository {
  /**
   * Obtiene la lista completa de MYPEs aliadas.
   */
  async getAll(): Promise<Mype[]> {
    return apiGet<Mype[]>('/api/mypes');
  }

  /**
   * Obtiene una MYPE por su ID.
   * @param id UUID de la MYPE.
   * @returns La MYPE o `null` si no existe (404).
   */
  async getById(id: string): Promise<Mype | null> {
    try {
      return await apiGet<Mype>(`/api/mypes/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Registra una nueva MYPE aliada.
   * @param dto Datos de la MYPE.
   * @returns La MYPE creada con ID asignado por el servidor.
   */
  async create(dto: CreateMypeDTO): Promise<Mype> {
    return apiPost<Mype>('/api/mypes', dto);
  }

  /**
   * Actualiza los datos de una MYPE.
   * @param id  UUID de la MYPE.
   * @param dto Campos a actualizar.
   */
  async update(id: string, dto: UpdateMypeDTO): Promise<Mype> {
    return apiPut<Mype>(`/api/mypes/${id}`, dto);
  }

  /**
   * Elimina una MYPE del registro.
   * @param id UUID de la MYPE.
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/mypes/${id}`);
  }
}
