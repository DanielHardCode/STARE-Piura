import { getRepositories } from '@/repositories';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';

export class MypeService {
  private get repos() {
    return getRepositories();
  }

  async getMypes(): Promise<Mype[]> {
    return this.repos.mypes.getAll();
  }

  async getMypeById(id: string): Promise<Mype | null> {
    return this.repos.mypes.getById(id);
  }

  async createMype(dto: CreateMypeDTO): Promise<Mype> {
    if (!dto.razon_social.trim()) {
      throw new Error('La razón social es obligatoria.');
    }
    if (!/^\d{11}$/.test(dto.ruc)) {
      throw new Error('El RUC debe tener 11 dígitos numéricos.');
    }
    return this.repos.mypes.create(dto);
  }

  async updateMype(id: string, dto: UpdateMypeDTO): Promise<Mype> {
    return this.repos.mypes.update(id, dto);
  }
}

export const mypeService = new MypeService();
