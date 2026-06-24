import type { Event, CreateEventDTO, UpdateEventDTO, SupplyItem, CreateSupplyItemDTO, UpdateSupplyItemDTO } from '@/types/index';

export interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  create(dto: CreateEventDTO): Promise<Event>;
  update(id: string, dto: UpdateEventDTO): Promise<Event>;
  getSupplyItems(eventId: string): Promise<SupplyItem[]>;
  createSupplyItem(dto: CreateSupplyItemDTO): Promise<SupplyItem>;
  updateSupplyItem(itemId: string, dto: UpdateSupplyItemDTO): Promise<SupplyItem>;
}
