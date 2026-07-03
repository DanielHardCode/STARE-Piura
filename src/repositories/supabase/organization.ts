import type { IOrganizationRepository } from '../contracts/organization';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';
import {
  fetchOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '@/lib/supabase/organizations';

export class SupabaseOrganizationRepository implements IOrganizationRepository {
  async getAll(): Promise<Organization[]> {
    return fetchOrganizations() as Promise<Organization[]>;
  }

  async getById(id: string): Promise<Organization | null> {
    try {
      return (await fetchOrganizationById(id)) as Organization;
    } catch (e: any) {
      if (e?.code === 'PGRST116') return null;
      throw e;
    }
  }

  async create(dto: CreateOrganizationDTO): Promise<Organization> {
    return createOrganization(dto as any) as Promise<Organization>;
  }

  async update(id: string, dto: UpdateOrganizationDTO): Promise<Organization> {
    return updateOrganization(id, dto as any) as Promise<Organization>;
  }

  async delete(id: string): Promise<void> {
    await deleteOrganization(id);
  }
}
