/**
 * @file src/repositories/supabase_laravel/organization.ts
 * @description Repositorio de Organizaciones para el provider `supabase_laravel`.
 * Todas las operaciones se delegan al backend Laravel mediante `apiFetch<T>`,
 * que inyecta automáticamente el JWT de Supabase Auth.
 *
 * Endpoints cubiertos:
 *  - GET    /api/organizations
 *  - GET    /api/organizations/{id}
 *  - POST   /api/organizations
 *  - PUT    /api/organizations/{id}
 *  - DELETE /api/organizations/{id}
 */

import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api-client';
import type { IOrganizationRepository } from '../contracts/organization';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';

export class SupabaseLaravelOrganizationRepository implements IOrganizationRepository {
  /**
   * Obtiene la lista completa de organizaciones.
   * @returns Array de organizaciones ordenado por nombre (backend).
   */
  async getAll(): Promise<Organization[]> {
    return apiGet<Organization[]>('/api/organizations');
  }

  /**
   * Obtiene una organización por su ID.
   * @param id UUID de la organización.
   * @returns La organización o `null` si no existe (404).
   */
  async getById(id: string): Promise<Organization | null> {
    try {
      return await apiGet<Organization>(`/api/organizations/${id}`);
    } catch (err: unknown) {
      if (err instanceof Error && 'status' in err && (err as { status: number }).status === 404) {
        return null;
      }
      throw err;
    }
  }

  /**
   * Crea una nueva organización.
   * @param dto Datos de la organización a crear.
   * @returns La organización creada con ID y timestamps asignados por el servidor.
   */
  async create(dto: CreateOrganizationDTO): Promise<Organization> {
    return apiPost<Organization>('/api/organizations', dto);
  }

  /**
   * Actualiza parcialmente una organización existente.
   * @param id  UUID de la organización.
   * @param dto Campos a actualizar (PATCH semántico, enviado como PUT).
   * @returns La organización con los datos actualizados.
   */
  async update(id: string, dto: UpdateOrganizationDTO): Promise<Organization> {
    return apiPut<Organization>(`/api/organizations/${id}`, dto);
  }

  /**
   * Elimina una organización.
   * @param id UUID de la organización a eliminar.
   */
  async delete(id: string): Promise<void> {
    await apiDelete(`/api/organizations/${id}`);
  }
}
