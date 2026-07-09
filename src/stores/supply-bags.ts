/**
 * @file src/stores/supply-bags.ts
 * @description Store Zustand para la gestión de Bolsas de Suministros.
 *
 * Acciones disponibles:
 *  - fetchBags       — Carga todas las bolsas.
 *  - fetchBagsByEvent — Filtra bolsas por evento (filtrado local tras fetch).
 *  - addBag          — Crea una nueva bolsa de suministros.
 *  - updateBag       — Actualiza nombre, descripción o estado de una bolsa.
 */

import { create } from 'zustand';
import type { SupplyBag, CreateSupplyBagDTO, UpdateSupplyBagDTO } from '@/types/index';
import { getRepositories } from '@/repositories';

interface SupplyBagState {
  bags: SupplyBag[];
  loading: boolean;
  error: string | null;

  /** Carga todas las bolsas de suministros. */
  fetchBags: () => Promise<void>;

  /** Retorna las bolsas asociadas a un evento (filtrado local). */
  getBagsByEvent: (eventId: string) => SupplyBag[];

  /** Crea una nueva bolsa de suministros para un evento. */
  addBag: (dto: CreateSupplyBagDTO) => Promise<SupplyBag>;

  /** Actualiza el estado o descripción de una bolsa. */
  updateBag: (id: string, dto: UpdateSupplyBagDTO) => Promise<SupplyBag>;
}

export const useSupplyBagStore = create<SupplyBagState>((set, get) => ({
  bags: [],
  loading: false,
  error: null,

  fetchBags: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getRepositories().supplyBags.getAll();
      set({ bags: data, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener bolsas de suministros';
      set({ error: message, loading: false });
    }
  },

  getBagsByEvent: (eventId) => {
    return get().bags.filter((b) => b.event_id === eventId);
  },

  addBag: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newBag = await getRepositories().supplyBags.create(dto);
      set((state) => ({
        bags: [...state.bags, newBag],
        loading: false,
      }));
      return newBag;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear bolsa de suministros';
      set({ error: message, loading: false });
      throw err;
    }
  },

  updateBag: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedBag = await getRepositories().supplyBags.update(id, dto);
      set((state) => ({
        bags: state.bags.map((b) => (b.id === id ? updatedBag : b)),
        loading: false,
      }));
      return updatedBag;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al actualizar bolsa de suministros';
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
