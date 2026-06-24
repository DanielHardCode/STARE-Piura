import { create } from 'zustand';
import type {
  EventWithBolsa,
  CreateEventDTO,
  UpdateEventDTO,
  SupplyItem,
  CreateSupplyItemDTO,
  UpdateSupplyItemDTO
} from '@/types/index';
import { eventService } from '@/services/event';

interface EventState {
  events: EventWithBolsa[];
  activeEvent: EventWithBolsa | null;
  selectedEventId: string | null;
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<EventWithBolsa | null>;
  setSelectedEventId: (id: string | null) => void;
  addEvent: (dto: CreateEventDTO) => Promise<EventWithBolsa>;
  updateEvent: (id: string, dto: UpdateEventDTO) => Promise<EventWithBolsa>;
  addSupplyItem: (dto: CreateSupplyItemDTO) => Promise<SupplyItem>;
  updateSupplyItem: (itemId: string, dto: UpdateSupplyItemDTO) => Promise<SupplyItem>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  activeEvent: null,
  selectedEventId: null,
  loading: false,
  error: null,

  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await eventService.getEvents();
      set((state) => ({
        events: data,
        loading: false,
        selectedEventId: state.selectedEventId || data[0]?.id || null,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener eventos', loading: false });
    }
  },

  setSelectedEventId: (id) => set({ selectedEventId: id }),


  fetchEventById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await eventService.getEventById(id);
      set({ activeEvent: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener evento por id', loading: false });
      return null;
    }
  },

  addEvent: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await eventService.createEvent(dto);
      set((state) => ({
        events: [newItem, ...state.events],
        loading: false,
      }));
      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al crear evento', loading: false });
      throw err;
    }
  },

  updateEvent: async (id, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await eventService.updateEvent(id, dto);
      set((state) => {
        const nextEvents = state.events.map((x) => (x.id === id ? updatedItem : x));
        const nextActive = state.activeEvent?.id === id ? updatedItem : state.activeEvent;
        return {
          events: nextEvents,
          activeEvent: nextActive,
          loading: false,
        };
      });
      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar evento', loading: false });
      throw err;
    }
  },

  addSupplyItem: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await eventService.createSupplyItem(dto);
      
      // Volver a cargar el evento activo enriquecido para recalcular cobertura
      const eventId = dto.event_id;
      const updatedEvent = await eventService.getEventById(eventId);
      
      set((state) => {
        const nextEvents = state.events.map((x) => (x.id === eventId && updatedEvent ? updatedEvent : x));
        return {
          events: nextEvents,
          activeEvent: state.activeEvent?.id === eventId && updatedEvent ? updatedEvent : state.activeEvent,
          loading: false,
        };
      });

      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al agregar ítem a la bolsa', loading: false });
      throw err;
    }
  },

  updateSupplyItem: async (itemId, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await eventService.updateSupplyItem(itemId, dto);
      const eventId = updatedItem.event_id;
      
      // Volver a cargar el evento activo enriquecido para recalcular cobertura
      const updatedEvent = await eventService.getEventById(eventId);

      set((state) => {
        const nextEvents = state.events.map((x) => (x.id === eventId && updatedEvent ? updatedEvent : x));
        return {
          events: nextEvents,
          activeEvent: state.activeEvent?.id === eventId && updatedEvent ? updatedEvent : state.activeEvent,
          loading: false,
        };
      });

      return updatedItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al actualizar ítem de la bolsa', loading: false });
      throw err;
    }
  },
}));
