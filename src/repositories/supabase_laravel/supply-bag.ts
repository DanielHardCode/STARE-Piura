/**
 * @file src/repositories/supabase_laravel/supply-bag.ts
 * @description Repositorio de Bolsas de Suministros para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET  /api/supply-bags
 *  - GET  /api/supply-bags/{id}
 *  - POST /api/supply-bags
 *  - PUT  /api/supply-bags/{id}
 */

import { apiGet, apiPost, apiPut } from '@/lib/api-client';
import type { ISupplyBagRepository } from '../contracts/supply-bag';
import type { SupplyBag, CreateSupplyBagDTO, UpdateSupplyBagDTO } from '@/types/index';

export class SupabaseLaravelSupplyBagRepository implements ISupplyBagRepository {
  /**
   * Obtiene la lista completa de bolsas de suministros.
   */
  async getAll(): Promise<SupplyBag[]> {
    return apiGet<SupplyBag[]>('/api/supply-bags');
  }

  /**
   * Obtiene una bolsa de suministros por su ID.
   * @param id UUID de la bolsa.
   * @returns La bolsa o `null` si no existe (404).
   */
  async getById(id: string): Promise<SupplyBag | null> {
    try {
      return await apiGet<SupplyBag>(`/api/supply-bags/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Crea una nueva bolsa de suministros asociada a un evento.
   * @param dto Datos de la bolsa a crear.
   * @returns La bolsa creada con ID y timestamps asignados por el servidor.
   */
  async create(dto: CreateSupplyBagDTO): Promise<SupplyBag> {
    return apiPost<SupplyBag>('/api/supply-bags', dto);
  }

  /**
   * Actualiza el estado o descripción de una bolsa de suministros.
   * @param id  UUID de la bolsa.
   * @param dto Campos a actualizar (nombre, descripción, estado).
   */
  async update(id: string, dto: UpdateSupplyBagDTO): Promise<SupplyBag> {
    return apiPut<SupplyBag>(`/api/supply-bags/${id}`, dto);
  }
}
