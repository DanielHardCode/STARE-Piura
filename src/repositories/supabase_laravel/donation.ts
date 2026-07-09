/**
 * @file src/repositories/supabase_laravel/donation.ts
 * @description Repositorio de Donaciones para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET  /api/donations
 *  - POST /api/donations
 *
 * Nota: La operación `update` no tiene endpoint dedicado en la especificación
 * del backend (solo GET y POST). Se mantiene `getByEventId` como filtro local
 * sobre el resultado de `getAll`.
 */

import { apiGet, apiPost } from '@/lib/api-client';
import type { IDonationRepository } from '../contracts/donation';
import type { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/types/index';

export class SupabaseLaravelDonationRepository implements IDonationRepository {
  /**
   * Obtiene la lista completa de donaciones.
   */
  async getAll(): Promise<Donation[]> {
    return apiGet<Donation[]>('/api/donations');
  }

  /**
   * Obtiene una donación por su ID.
   * Realiza un GET a la colección y filtra localmente para evitar exponer
   * un endpoint de detalle no contemplado en la especificación.
   *
   * @param id UUID de la donación.
   * @returns La donación o `null` si no existe.
   */
  async getById(id: string): Promise<Donation | null> {
    const all = await this.getAll();
    return all.find((d) => d.id === id) ?? null;
  }

  /**
   * Registra una nueva donación.
   * @param dto Datos de la donación (puede ser monetaria o en especie).
   * @returns La donación creada con ID y timestamps asignados por el servidor.
   */
  async create(dto: CreateDonationDTO): Promise<Donation> {
    return apiPost<Donation>('/api/donations', dto);
  }

  /**
   * Actualiza datos opcionales de una donación (descripción, comprobante, evento).
   * @param id  UUID de la donación.
   * @param dto Campos actualizables.
   */
  async update(id: string, dto: UpdateDonationDTO): Promise<Donation> {
    // Laravel expone update en el mismo recurso
    const { apiPut } = await import('@/lib/api-client');
    return apiPut<Donation>(`/api/donations/${id}`, dto);
  }

  /**
   * Filtra donaciones por evento. Útil para la vista de detalle de un evento.
   * @param eventId UUID del evento.
   */
  async getByEventId(eventId: string): Promise<Donation[]> {
    const all = await this.getAll();
    return all.filter((d) => d.event_id === eventId);
  }
}
