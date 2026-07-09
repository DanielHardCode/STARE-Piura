/**
 * @file src/repositories/supabase_laravel/donor.ts
 * @description Repositorio de Donantes para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET  /api/donors
 *  - POST /api/donors
 *  - PUT  /api/donors/{id}
 */

import { apiGet, apiPost, apiPut } from '@/lib/api-client';
import type { IDonorRepository } from '../contracts/donor';
import type { Donor, CreateDonorDTO, UpdateDonorDTO } from '@/types/index';

export class SupabaseLaravelDonorRepository implements IDonorRepository {
  /**
   * Obtiene la lista completa de donantes.
   */
  async getAll(): Promise<Donor[]> {
    return apiGet<Donor[]>('/api/donors');
  }

  /**
   * Obtiene un donante por su ID.
   * @param id UUID del donante.
   * @returns El donante o `null` si no existe (404).
   */
  async getById(id: string): Promise<Donor | null> {
    try {
      return await apiGet<Donor>(`/api/donors/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Registra un nuevo donante.
   * @param dto Datos del donante.
   * @returns El donante creado con ID y timestamp asignados por el servidor.
   */
  async create(dto: CreateDonorDTO): Promise<Donor> {
    return apiPost<Donor>('/api/donors', dto);
  }

  /**
   * Actualiza los datos de un donante.
   * @param id  UUID del donante.
   * @param dto Campos a actualizar.
   */
  async update(id: string, dto: UpdateDonorDTO): Promise<Donor> {
    return apiPut<Donor>(`/api/donors/${id}`, dto);
  }
}
