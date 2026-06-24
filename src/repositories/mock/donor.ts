import type { IDonorRepository } from '../contracts/donor';
import type { Donor, CreateDonorDTO } from '@/types/index';
import { MOCK_DONORS } from '@/mocks';
import { delay } from './utils';

export class MockDonorRepository implements IDonorRepository {
  private static items: Donor[] = [...MOCK_DONORS];

  async getAll(): Promise<Donor[]> {
    await delay();
    return [...MockDonorRepository.items];
  }

  async getById(id: string): Promise<Donor | null> {
    await delay();
    const item = MockDonorRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateDonorDTO): Promise<Donor> {
    await delay();
    const id = `donor-${String(MockDonorRepository.items.length + 1).padStart(3, '0')}`;
    const newItem: Donor = {
      id,
      nombres: dto.nombres,
      tipo: dto.tipo,
      documento: dto.documento,
      telefono: dto.telefono,
      email: dto.email,
      distrito: dto.distrito,
      mype_id: dto.mype_id,
      created_at: new Date().toISOString(),
    };
    MockDonorRepository.items.push(newItem);
    return { ...newItem };
  }
}
