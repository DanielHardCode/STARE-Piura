import { getRepositories } from '@/repositories';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';

export class OrganizationService {
  private get repos() {
    return getRepositories();
  }

  async getOrganizations(): Promise<Organization[]> {
    return this.repos.organizations.getAll();
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return this.repos.organizations.getById(id);
  }

  async createOrganization(dto: CreateOrganizationDTO): Promise<Organization> {
    // Validaciones de negocio o enriquecimientos aquí
    if (!dto.nombre.trim()) {
      throw new Error('El nombre de la organización es obligatorio.');
    }
    return this.repos.organizations.create(dto);
  }

  async updateOrganization(id: string, dto: UpdateOrganizationDTO): Promise<Organization> {
    return this.repos.organizations.update(id, dto);
  }

  async deleteOrganization(id: string): Promise<void> {
    return this.repos.organizations.delete(id);
  }
}

export const organizationService = new OrganizationService();
