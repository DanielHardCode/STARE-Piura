/**
 * @file src/hooks/useSupplyBags.ts
 * @description Hook React para la gestión de Bolsas de Suministros.
 *
 * Carga las bolsas automáticamente al montar y permite filtrar por evento.
 *
 * @example
 * ```tsx
 * // Todas las bolsas
 * const { bags, isLoading, addBag } = useSupplyBags();
 *
 * // Bolsas de un evento específico
 * const { bags, isLoading } = useSupplyBags('evt-001');
 * ```
 */

import { useEffect, useCallback } from 'react';
import { useSupplyBagStore } from '@/stores/supply-bags';
import type { CreateSupplyBagDTO, UpdateSupplyBagDTO } from '@/types/index';

/**
 * Hook para gestión de bolsas de suministros.
 *
 * @param eventId UUID del evento. Si se provee, `bags` retorna solo las bolsas de ese evento.
 *
 * @returns Objeto con el estado y las acciones para gestionar bolsas.
 *
 * | Campo       | Descripción                                                  |
 * |-------------|--------------------------------------------------------------|
 * | `bags`      | Bolsas de suministros (filtradas por `eventId` si se pasa).  |
 * | `allBags`   | Todas las bolsas sin filtrar.                                |
 * | `isLoading` | `true` mientras hay una operación en curso.                  |
 * | `error`     | Mensaje de error de la última operación fallida.             |
 * | `addBag`    | Crea una nueva bolsa de suministros.                         |
 * | `updateBag` | Actualiza nombre, descripción o estado de una bolsa.         |
 */
export function useSupplyBags(eventId?: string) {
  const {
    bags: allBags,
    loading: isLoading,
    error,
    fetchBags,
    getBagsByEvent,
    addBag: storeAddBag,
    updateBag: storeUpdateBag,
  } = useSupplyBagStore();

  // Carga inicial si el store está vacío
  useEffect(() => {
    if (allBags.length === 0) {
      fetchBags();
    }
  }, [fetchBags, allBags.length]);

  // Filtrar por evento si se provee eventId
  const bags = eventId ? getBagsByEvent(eventId) : allBags;

  /**
   * Crea una nueva bolsa de suministros para un evento.
   * @param dto Datos de la bolsa (event_id, nombre, descripción opcional).
   */
  const addBag = useCallback(
    (dto: CreateSupplyBagDTO) => storeAddBag(dto),
    [storeAddBag]
  );

  /**
   * Actualiza el estado o metadatos de una bolsa.
   * @param id  UUID de la bolsa.
   * @param dto Campos a actualizar.
   */
  const updateBag = useCallback(
    (id: string, dto: UpdateSupplyBagDTO) => storeUpdateBag(id, dto),
    [storeUpdateBag]
  );

  return {
    bags,
    allBags,
    isLoading,
    error,
    fetchBags,
    addBag,
    updateBag,
  };
}
