import { create } from 'zustand';
import type { Donation, CreateDonationDTO, UpdateDonationDTO, Donor, CreateDonorDTO } from '@/types/index';
import { donationService } from '@/services/donation';

interface DonationState {
  donations: Donation[];
  donors: Donor[];
  loading: boolean;
  error: string | null;
  fetchDonations: () => Promise<void>;
  fetchDonors: () => Promise<void>;
  addDonation: (dto: CreateDonationDTO) => Promise<Donation>;
  addDonor: (dto: CreateDonorDTO) => Promise<Donor>;
  updateDonation: (id: string, dto: UpdateDonationDTO) => Promise<Donation>;
}

export const useDonationStore = create<DonationState>((set) => ({
  donations: [],
  donors: [],
  loading: false,
  error: null,

  fetchDonations: async () => {
    set({ loading: true, error: null });
    try {
      const data = await donationService.getDonations();
      set({ donations: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener donaciones', loading: false });
    }
  },

  fetchDonors: async () => {
    set({ loading: true, error: null });
    try {
      const data = await donationService.getDonors();
      set({ donors: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener donantes', loading: false });
    }
  },

  addDonation: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await donationService.createDonation(dto);
      set((state) => ({
        donations: [newItem, ...state.donations], // Las más recientes primero
        loading: false,
      }));
      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al registrar donación', loading: false });
      throw err;
    }
  },

  addDonor: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await donationService.createDonor(dto);
      set((state) => ({
        donors: [...state.donors, newItem],
        loading: false,
      }));
      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al registrar donante', loading: false });
      throw err;
    }
  },

  updateDonation: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await donationService.updateDonation(id, dto);
      set((state) => ({
        donations: state.donations.map((x) => (x.id === id ? updatedItem : x)),
        loading: false,
      }));
      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar donación', loading: false });
      throw err;
    }
  },
}));
