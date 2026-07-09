/**
 * @file src/repositories/mock/supply-bag.ts
 * @description Implementación mock del repositorio de Bolsas de Suministros.
 * Usa datos en memoria para desarrollo y pruebas sin backend.
 */

import type { ISupplyBagRepository } from '../contracts/supply-bag';
import type { SupplyBag, CreateSupplyBagDTO, UpdateSupplyBagDTO } from '@/types/index';
import { delay } from './utils';

export class MockSupplyBagRepository implements ISupplyBagRepository {
  private static items: SupplyBag[] = [
    {
      id: 'bag-001',
      event_id: 'evt-001',
      nombre: 'Bolsa Alimentaria Principal',
      descripcion: 'Contiene víveres para 50 familias',
      status: 'parcial',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  async getAll(): Promise<SupplyBag[]> {
    await delay();
    return [...MockSupplyBagRepository.items.map((x) => ({ ...x }))];
  }

  async getById(id: string): Promise<SupplyBag | null> {
    await delay();
    const item = MockSupplyBagRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateSupplyBagDTO): Promise<SupplyBag> {
    await delay();
    const now = new Date().toISOString();
    const newItem: SupplyBag = {
      id: `bag-${String(MockSupplyBagRepository.items.length + 1).padStart(3, '0')}`,
      event_id: dto.event_id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      status: 'pendiente',
      created_at: now,
      updated_at: now,
    };
    MockSupplyBagRepository.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, dto: UpdateSupplyBagDTO): Promise<SupplyBag> {
    await delay();
    const idx = MockSupplyBagRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Bolsa con id ${id} no encontrada`);
    }
    const updated: SupplyBag = {
      ...MockSupplyBagRepository.items[idx],
      ...dto,
      updated_at: new Date().toISOString(),
    };
    MockSupplyBagRepository.items[idx] = updated;
    return { ...updated };
  }
}
