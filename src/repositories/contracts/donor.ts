import type { Donor, CreateDonorDTO } from '@/types/index';

export interface IDonorRepository {
  getAll(): Promise<Donor[]>;
  getById(id: string): Promise<Donor | null>;
  create(dto: CreateDonorDTO): Promise<Donor>;
}
