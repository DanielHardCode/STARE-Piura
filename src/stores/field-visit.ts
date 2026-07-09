/**
 * @file src/stores/field-visit.ts
 * @description Store Zustand para las Visitas de Campo (rol Voluntario).
 *
 * Diseñado para soporte offline-first:
 *  - Las evidencias se agregan con URLs públicas (ya subidas al Storage).
 *  - El cierre del evento se realiza con `completeEvent` que cambia el status a `realizada`.
 *
 * Acciones disponibles:
 *  - fetchEvidences  — Carga evidencias de un evento.
 *  - addEvidence     — Agrega una evidencia al evento activo.
 *  - completeEvent   — Cierra el evento con evidencias y notas.
 *  - setActiveEventId — Establece el evento en vista.
 */

import { create } from 'zustand';
import type { Evidence, CreateEvidenceDTO, CompleteEventDTO, Event } from '@/types/index';
import { getRepositories } from '@/repositories';

interface FieldVisitState {
  /** ID del evento actualmente en vista de campo. */
  activeEventId: string | null;
  evidences: Evidence[];
  loading: boolean;
  error: string | null;

  /** Establece el evento activo para la vista de campo. */
  setActiveEventId: (eventId: string | null) => void;

  /**
   * Carga las evidencias de un evento desde el backend.
   * @param eventId UUID del evento.
   */
  fetchEvidences: (eventId: string) => Promise<void>;

  /**
   * Agrega una evidencia al evento activo.
   * La URL debe ser pública (ya subida a Storage en el cliente).
   *
   * @param eventId UUID del evento.
   * @param dto     Datos de la evidencia.
   */
  addEvidence: (eventId: string, dto: CreateEvidenceDTO) => Promise<Evidence>;

  /**
   * Cierra un evento de campo y registra las evidencias.
   * Cambia el status del evento a `realizada`.
   *
   * @param eventId UUID del evento.
   * @param dto     URLs de evidencia (ya subidas) y notas de cierre.
   * @returns El evento actualizado.
   */
  completeEvent: (eventId: string, dto: CompleteEventDTO) => Promise<Event>;
}

export const useFieldVisitStore = create<FieldVisitState>((set) => ({
  activeEventId: null,
  evidences: [],
  loading: false,
  error: null,

  setActiveEventId: (eventId) => {
    set({ activeEventId: eventId, evidences: [], error: null });
  },

  fetchEvidences: async (eventId) => {
    set({ loading: true, error: null });
    try {
      const data = await getRepositories().fieldVisits.getEvidences(eventId);
      set({ evidences: data, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al obtener evidencias';
      set({ error: message, loading: false });
    }
  },

  addEvidence: async (eventId, dto) => {
    set({ loading: true, error: null });
    try {
      const newEvidence = await getRepositories().fieldVisits.addEvidence(eventId, dto);
      set((state) => ({
        evidences: [...state.evidences, newEvidence],
        loading: false,
      }));
      return newEvidence;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al agregar evidencia';
      set({ error: message, loading: false });
      throw err;
    }
  },

  completeEvent: async (eventId, dto) => {
    set({ loading: true, error: null });
    try {
      const updatedEvent = await getRepositories().fieldVisits.completeEvent(eventId, dto);
      set({ loading: false });
      return updatedEvent;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al completar el evento';
      set({ error: message, loading: false });
      throw err;
    }
  },
}));
