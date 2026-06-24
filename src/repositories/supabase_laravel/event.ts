import type { IEventRepository } from '../contracts/event';
import type {
  Event,
  CreateEventDTO,
  UpdateEventDTO,
  SupplyItem,
  CreateSupplyItemDTO,
  UpdateSupplyItemDTO
} from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelEventRepository implements IEventRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<Event[]> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .order('start_time', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener eventos de Supabase: ${error.message}`);
    }

    return (data || []) as Event[];
  }

  async getById(id: string): Promise<Event | null> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error al obtener evento de Supabase: ${error.message}`);
    }

    return data as Event;
  }

  async create(dto: CreateEventDTO): Promise<Event> {
    return laravelApi.post<Event>('/events', dto);
  }

  async update(id: string, dto: UpdateEventDTO): Promise<Event> {
    return laravelApi.put<Event>(`/events/${id}`, dto);
  }

  async getSupplyItems(eventId: string): Promise<SupplyItem[]> {
    const { data, error } = await this.client
      .from('supply_items')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      throw new Error(`Error al obtener ítems de bolsa de Supabase: ${error.message}`);
    }

    return (data || []) as SupplyItem[];
  }

  async createSupplyItem(dto: CreateSupplyItemDTO): Promise<SupplyItem> {
    return laravelApi.post<SupplyItem>('/supply-items', dto);
  }

  async updateSupplyItem(itemId: string, dto: UpdateSupplyItemDTO): Promise<SupplyItem> {
    return laravelApi.put<SupplyItem>(`/supply-items/${itemId}`, dto);
  }
}
