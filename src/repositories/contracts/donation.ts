import type { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/types/index';

export interface IDonationRepository {
  getAll(): Promise<Donation[]>;
  getById(id: string): Promise<Donation | null>;
  create(dto: CreateDonationDTO): Promise<Donation>;
  update(id: string, dto: UpdateDonationDTO): Promise<Donation>;
  getByEventId(eventId: string): Promise<Donation[]>;
}
