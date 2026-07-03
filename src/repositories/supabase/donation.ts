import type { IDonationRepository } from '../contracts/donation';
import type { Donation, CreateDonationDTO, UpdateDonationDTO } from '@/types/index';
import {
  fetchDonations,
  fetchDonationById,
  createDonation,
  updateDonation,
} from '@/lib/supabase/donations';

export class SupabaseDonationRepository implements IDonationRepository {
  async getAll(): Promise<Donation[]> {
    return fetchDonations() as Promise<Donation[]>;
  }

  async getById(id: string): Promise<Donation | null> {
    try {
      return (await fetchDonationById(id)) as Donation;
    } catch (e: any) {
      if (e?.code === 'PGRST116') return null;
      throw e;
    }
  }

  async create(dto: CreateDonationDTO): Promise<Donation> {
    return createDonation(dto as any) as Promise<Donation>;
  }

  async update(id: string, dto: UpdateDonationDTO): Promise<Donation> {
    return updateDonation(id, dto as any) as Promise<Donation>;
  }

  async getByEventId(eventId: string): Promise<Donation[]> {
    const all = await this.getAll();
    return all.filter((d) => d.event_id === eventId);
  }
}
