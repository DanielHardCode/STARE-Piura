import type { IMypeRepository } from '../contracts/mype';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelMypeRepository implements IMypeRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<Mype[]> {
    const { data, error } = await this.client
      .from('mypes')
      .select('*')
      .order('razon_social', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener MYPEs de Supabase: ${error.message}`);
    }

    return (data || []) as Mype[];
  }

  async getById(id: string): Promise<Mype | null> {
    const { data, error } = await this.client
      .from('mypes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Error al obtener MYPE de Supabase: ${error.message}`);
    }

    return data as Mype;
  }

  async create(dto: CreateMypeDTO): Promise<Mype> {
    return laravelApi.post<Mype>('/mypes', dto);
  }

  async update(id: string, dto: UpdateMypeDTO): Promise<Mype> {
    return laravelApi.put<Mype>(`/mypes/${id}`, dto);
  }
}
