import type { IDonationRepository } from '../contracts/donation';
import type { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/types/index';
import { MOCK_DONATIONS } from '@/mocks';
import { delay } from './utils';

export class MockDonationRepository implements IDonationRepository {
  private static items: Donation[] = [...MOCK_DONATIONS];

  async getAll(): Promise<Donation[]> {
    await delay();
    return [...MockDonationRepository.items];
  }

  async getById(id: string): Promise<Donation | null> {
    await delay();
    const item = MockDonationRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateDonationDTO): Promise<Donation> {
    await delay();
    const id = `don-${String(MockDonationRepository.items.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newItem: Donation = {
      id,
      donor_id: dto.donor_id,
      donor_nombre: dto.donor_nombre,
      tipo: dto.tipo,
      medio_pago: dto.medio_pago,
      monto: dto.monto,
      items: dto.items,
      descripcion: dto.descripcion,
      fondo_destino: dto.fondo_destino,
      event_id: dto.event_id,
      comprobante_url: dto.comprobante_url,
      fecha: dto.fecha || now,
      created_at: now,
    };
    MockDonationRepository.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, dto: UpdateDonationDTO): Promise<Donation> {
    await delay();
    const idx = MockDonationRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Donación con id ${id} no encontrada`);
    }
    const current = MockDonationRepository.items[idx];
    const updated: Donation = {
      ...current,
      ...dto,
    };
    MockDonationRepository.items[idx] = updated;
    return { ...updated };
  }

  async getByEventId(eventId: string): Promise<Donation[]> {
    await delay();
    return MockDonationRepository.items.filter((x) => x.event_id === eventId).map((x) => ({ ...x }));
  }
}
