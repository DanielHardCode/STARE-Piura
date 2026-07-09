import type { Donor, CreateDonorDTO, UpdateDonorDTO } from '@/types/index';

export interface IDonorRepository {
  getAll(): Promise<Donor[]>;
  getById(id: string): Promise<Donor | null>;
  create(dto: CreateDonorDTO): Promise<Donor>;
  update(id: string, dto: UpdateDonorDTO): Promise<Donor>;
}

