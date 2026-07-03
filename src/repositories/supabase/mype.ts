import type { IMypeRepository } from '../contracts/mype';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';
import {
  fetchMypes,
  fetchMypeById,
  createMype,
  updateMype,
} from '@/lib/supabase/mypes';

export class SupabaseMypeRepository implements IMypeRepository {
  async getAll(): Promise<Mype[]> {
    return fetchMypes() as Promise<Mype[]>;
  }

  async getById(id: string): Promise<Mype | null> {
    try {
      return (await fetchMypeById(id)) as Mype;
    } catch (e: any) {
      if (e?.code === 'PGRST116') return null;
      throw e;
    }
  }

  async create(dto: CreateMypeDTO): Promise<Mype> {
    return createMype(dto as any) as Promise<Mype>;
  }

  async update(id: string, dto: UpdateMypeDTO): Promise<Mype> {
    return updateMype(id, dto as any) as Promise<Mype>;
  }
}
