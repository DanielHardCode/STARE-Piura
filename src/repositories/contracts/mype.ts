import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';

export interface IMypeRepository {
  getAll(): Promise<Mype[]>;
  getById(id: string): Promise<Mype | null>;
  create(dto: CreateMypeDTO): Promise<Mype>;
  update(id: string, dto: UpdateMypeDTO): Promise<Mype>;
}
