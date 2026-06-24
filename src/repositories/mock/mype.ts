import type { IMypeRepository } from '../contracts/mype';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';
import { MOCK_MYPES } from '@/mocks';
import { delay } from './utils';

export class MockMypeRepository implements IMypeRepository {
  private static items: Mype[] = [...MOCK_MYPES];

  async getAll(): Promise<Mype[]> {
    await delay();
    return [...MockMypeRepository.items];
  }

  async getById(id: string): Promise<Mype | null> {
    await delay();
    const item = MockMypeRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateMypeDTO): Promise<Mype> {
    await delay();
    const id = `mype-${String(MockMypeRepository.items.length + 1).padStart(3, '0')}`;
    const newItem: Mype = {
      id,
      razon_social: dto.razon_social,
      ruc: dto.ruc,
      rubro: dto.rubro,
      contacto: dto.contacto,
      telefono: dto.telefono,
      email: dto.email,
      distrito: dto.distrito,
      activo: true,
      historial_aportes: 0,
      created_at: new Date().toISOString(),
    };
    MockMypeRepository.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, dto: UpdateMypeDTO): Promise<Mype> {
    await delay();
    const idx = MockMypeRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Mype con id ${id} no encontrada`);
    }
    const current = MockMypeRepository.items[idx];
    const updated: Mype = {
      ...current,
      ...dto,
    };
    MockMypeRepository.items[idx] = updated;
    return { ...updated };
  }
}
