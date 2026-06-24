import { create } from 'zustand';
import type { Mype, CreateMypeDTO, UpdateMypeDTO } from '@/types/index';
import { mypeService } from '@/services/mype';

interface MypeState {
  mypes: Mype[];
  loading: boolean;
  error: string | null;
  fetchMypes: () => Promise<void>;
  addMype: (dto: CreateMypeDTO) => Promise<Mype>;
  updateMype: (id: string, dto: UpdateMypeDTO) => Promise<Mype>;
}

export const useMypeStore = create<MypeState>((set) => ({
  mypes: [],
  loading: false,
  error: null,

  fetchMypes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await mypeService.getMypes();
      set({ mypes: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener MYPEs', loading: false });
    }
  },

  addMype: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await mypeService.createMype(dto);
      set((state) => ({
        mypes: [...state.mypes, newItem],
        loading: false,
      }));
      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al agregar MYPE', loading: false });
      throw err;
    }
  },

  updateMype: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await mypeService.updateMype(id, dto);
      set((state) => ({
        mypes: state.mypes.map((x) => (x.id === id ? updatedItem : x)),
        loading: false,
      }));
      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar MYPE', loading: false });
      throw err;
    }
  },
}));
