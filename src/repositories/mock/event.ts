import type { IEventRepository } from '../contracts/event';
import type { Event, CreateEventDTO, UpdateEventDTO, SupplyItem, CreateSupplyItemDTO, UpdateSupplyItemDTO } from '@/types/index';
import { MOCK_EVENTS, MOCK_SUPPLY_ITEMS } from '@/mocks';
import { delay } from './utils';

export class MockEventRepository implements IEventRepository {
  private static items: Event[] = [...MOCK_EVENTS];
  private static supplyItems: SupplyItem[] = [...MOCK_SUPPLY_ITEMS];

  async getAll(): Promise<Event[]> {
    await delay();
    return [...MockEventRepository.items];
  }

  async getById(id: string): Promise<Event | null> {
    await delay();
    const item = MockEventRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async create(dto: CreateEventDTO): Promise<Event> {
    await delay();
    const id = `evt-${String(MockEventRepository.items.length + 1).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newItem: Event = {
      id,
      organization_id: dto.organization_id,
      organization_nombre: dto.organization_nombre,
      title: dto.title,
      description: dto.description,
      distrito: dto.distrito,
      target_audience: dto.target_audience,
      start_time: dto.start_time,
      end_time: dto.end_time,
      status: 'programada',
      coordinador_id: dto.coordinador_id,
      notes: dto.notes,
      created_at: now,
      updated_at: now,
    };
    MockEventRepository.items.push(newItem);
    return { ...newItem };
  }

  async update(id: string, dto: UpdateEventDTO): Promise<Event> {
    await delay();
    const idx = MockEventRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Evento con id ${id} no encontrado`);
    }
    const current = MockEventRepository.items[idx];
    const updated: Event = {
      ...current,
      ...dto,
      updated_at: new Date().toISOString(),
    } as Event;
    MockEventRepository.items[idx] = updated;
    return { ...updated };
  }

  async getSupplyItems(eventId: string): Promise<SupplyItem[]> {
    await delay();
    return MockEventRepository.supplyItems
      .filter((x) => x.event_id === eventId)
      .map((x) => ({ ...x }));
  }

  async createSupplyItem(dto: CreateSupplyItemDTO): Promise<SupplyItem> {
    await delay();
    const id = `supply-${String(MockEventRepository.supplyItems.length + 1).padStart(4, '0')}`;
    const newItem: SupplyItem = {
      id,
      event_id: dto.event_id,
      nombre: dto.nombre,
      categoria: dto.categoria,
      unidad: dto.unidad,
      cantidad_requerida: dto.cantidad_requerida,
      cantidad_cubierta: dto.cantidad_cubierta ?? 0,
      precio_unitario_estimado: dto.precio_unitario_estimado,
      created_at: new Date().toISOString(),
    };
    MockEventRepository.supplyItems.push(newItem);
    return { ...newItem };
  }

  async updateSupplyItem(itemId: string, dto: UpdateSupplyItemDTO): Promise<SupplyItem> {
    await delay();
    const idx = MockEventRepository.supplyItems.findIndex((x) => x.id === itemId);
    if (idx === -1) {
      throw new Error(`Ítem de bolsa con id ${itemId} no encontrado`);
    }
    const current = MockEventRepository.supplyItems[idx];
    const updated: SupplyItem = {
      ...current,
      ...dto,
    };
    MockEventRepository.supplyItems[idx] = updated;
    return { ...updated };
  }
}
