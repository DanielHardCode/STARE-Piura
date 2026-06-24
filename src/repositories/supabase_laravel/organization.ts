import type { IOrganizationRepository } from '../contracts/organization';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelOrganizationRepository implements IOrganizationRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado. Verifique VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
    }
    return supabase;
  }

  async getAll(): Promise<Organization[]> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      throw new Error(`Error al obtener organizaciones de Supabase: ${error.message}`);
    }

    return (data || []) as Organization[];
  }

  async getById(id: string): Promise<Organization | null> {
    const { data, error } = await this.client
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No rows found
      throw new Error(`Error al obtener organización de Supabase: ${error.message}`);
    }

    return data as Organization;
  }

  async create(dto: CreateOrganizationDTO): Promise<Organization> {
    // Las operaciones de escritura pasan por la API Laravel para validaciones y lógica de negocio
    return laravelApi.post<Organization>('/organizations', dto);
  }

  async update(id: string, dto: UpdateOrganizationDTO): Promise<Organization> {
    return laravelApi.put<Organization>(`/organizations/${id}`, dto);
  }

  async delete(id: string): Promise<void> {
    await laravelApi.delete(`/organizations/${id}`);
  }
}
