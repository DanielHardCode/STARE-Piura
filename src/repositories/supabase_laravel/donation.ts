import type { IDonationRepository } from '../contracts/donation';
import type { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelDonationRepository implements IDonationRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<Donation[]> {
    const { data, error } = await this.client
      .from('donations')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener donaciones de Supabase: ${error.message}`);
    }

    return (data || []) as Donation[];
  }

  async getById(id: string): Promise<Donation | null> {
    const { data, error } = await this.client
      .from('donations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error al obtener donación de Supabase: ${error.message}`);
    }

    return data as Donation;
  }

  async create(dto: CreateDonationDTO): Promise<Donation> {
    return laravelApi.post<Donation>('/donations', dto);
  }

  async update(id: string, dto: UpdateDonationDTO): Promise<Donation> {
    return laravelApi.put<Donation>(`/donations/${id}`, dto);
  }

  async getByEventId(eventId: string): Promise<Donation[]> {
    const { data, error } = await this.client
      .from('donations')
      .select('*')
      .eq('event_id', eventId);

    if (error) {
      throw new Error(`Error al obtener donaciones por evento de Supabase: ${error.message}`);
    }

    return (data || []) as Donation[];
  }
}
