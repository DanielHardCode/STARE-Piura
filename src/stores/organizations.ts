import { create } from 'zustand';
import type { Organization, CreateOrganizationDTO, UpdateOrganizationDTO } from '@/types/index';
import { organizationService } from '@/services/organization';

interface OrganizationState {
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  fetchOrganizations: () => Promise<void>;
  addOrganization: (dto: CreateOrganizationDTO) => Promise<Organization>;
  updateOrganization: (id: string, dto: UpdateOrganizationDTO) => Promise<Organization>;
  deleteOrganization: (id: string) => Promise<void>;
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  loading: false,
  error: null,

  fetchOrganizations: async () => {
    set({ loading: true, error: null });
    try {
      const data = await organizationService.getOrganizations();
      set({ organizations: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener organizaciones', loading: false });
    }
  },

  addOrganization: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await organizationService.createOrganization(dto);
      set((state) => ({
        organizations: [...state.organizations, newItem],
        loading: false,
      }));
      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al agregar organización', loading: false });
      throw err;
    }
  },

  updateOrganization: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await organizationService.updateOrganization(id, dto);
      set((state) => ({
        organizations: state.organizations.map((x) => (x.id === id ? updatedItem : x)),
        loading: false,
      }));
      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar organización', loading: false });
      throw err;
    }
  },

  deleteOrganization: async (id) => {
    set({ loading: true, error: null });
    try {
      await organizationService.deleteOrganization(id);
      set((state) => ({
        organizations: state.organizations.filter((x) => x.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Error al eliminar organización', loading: false });
      throw err;
    }
  },
}));
