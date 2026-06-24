import type { IOrganizationRepository } from '../contracts/organization';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';
import { MOCK_ORGANIZATIONS } from '@/mocks';
import { delay } from './utils';

export class MockOrganizationRepository implements IOrganizationRepository {
  private static items: Organization[] = [...MOCK_ORGANIZATIONS];

  async getAll(): Promise<Organization[]> {
    await delay();
    return [...MockOrganizationRepository.items];
  }

  async getById(id: string): Promise<Organization | null> {
    await delay();
    const item = MockOrganizationRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateOrganizationDTO): Promise<Organization> {
    await delay();
    const id = `org-${String(MockOrganizationRepository.items.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newItem: Organization = {
      id,
      nombre: dto.nombre,
      tipo: dto.tipo,
      direccion: dto.direccion,
      distrito: dto.distrito,
      telefono: dto.telefono,
      encargado: dto.encargado,
      email: dto.email,
      beneficiarios_estimados: dto.beneficiarios_estimados,
      necesidades: dto.necesidades || [],
      activo: true,
      created_at: now,
      updated_at: now,
    };
    MockOrganizationRepository.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, dto: UpdateOrganizationDTO): Promise<Organization> {
    await delay();
    const idx = MockOrganizationRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Organización con id ${id} no encontrada`);
    }
    const current = MockOrganizationRepository.items[idx];
    const updated: Organization = {
      ...current,
      ...dto,
      necesidades: dto.necesidades || current.necesidades,
      updated_at: new Date().toISOString(),
    };
    MockOrganizationRepository.items[idx] = updated;
    return { ...updated };
  }

  async delete(id: string): Promise<void> {
    await delay();
    const idx = MockOrganizationRepository.items.findIndex((x) => x.id === id);
    if (idx !== -1) {
      // In a real soft delete or hard delete. Here we just hard delete from mock.
      MockOrganizationRepository.items.splice(idx, 1);
    }
  }
}
