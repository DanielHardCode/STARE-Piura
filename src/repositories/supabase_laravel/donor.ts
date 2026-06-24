import type { IDonorRepository } from '../contracts/donor';
import type { Donor, CreateDonorDTO } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelDonorRepository implements IDonorRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<Donor[]> {
    const { data, error } = await this.client
      .from('donors')
      .select('*')
      .order('nombres', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener donantes de Supabase: ${error.message}`);
    }

    return (data || []) as Donor[];
  }

  async getById(id: string): Promise<Donor | null> {
    const { data, error } = await this.client
      .from('donors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error al obtener donante de Supabase: ${error.message}`);
    }

    return data as Donor;
  }

  async create(dto: CreateDonorDTO): Promise<Donor> {
    return laravelApi.post<Donor>('/donors', dto);
  }
}
