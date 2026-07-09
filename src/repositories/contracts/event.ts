import type { Event, CreateEventDTO, UpdateEventDTO, SupplyItem, CreateSupplyItemDTO, UpdateSupplyItemDTO, CoverSupplyItemDTO } from '@/types/index';

export interface IEventRepository {
  getAll(): Promise<Event[]>;
  getById(id: string): Promise<Event | null>;
  create(dto: CreateEventDTO): Promise<Event>;
  update(id: string, dto: UpdateEventDTO): Promise<Event>;
  delete(id: string): Promise<void>;
  getSupplyItems(eventId: string): Promise<SupplyItem[]>;
  createSupplyItem(dto: CreateSupplyItemDTO): Promise<SupplyItem>;
  updateSupplyItem(itemId: string, dto: UpdateSupplyItemDTO): Promise<SupplyItem>;
  deleteSupplyItem(itemId: string): Promise<void>;
  coverSupplyItem(dto: CoverSupplyItemDTO): Promise<SupplyItem>;
}
