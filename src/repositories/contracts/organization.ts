import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';

export interface IOrganizationRepository {
  getAll(): Promise<Organization[]>;
  getById(id: string): Promise<Organization | null>;
  create(dto: CreateOrganizationDTO): Promise<Organization>;
  update(id: string, dto: UpdateOrganizationDTO): Promise<Organization>;
  delete(id: string): Promise<void>;
}
