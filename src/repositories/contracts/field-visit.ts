import type { Evidence, CreateEvidenceDTO, CompleteEventDTO, Event } from '@/types/index';

/**
 * Contrato del repositorio de Visitas de Campo (rol Voluntario).
 * Implementa un enfoque offline-first: la subida de archivos se realizó
 * previamente en el cliente y las URLs públicas llegan en el DTO.
 *
 * Endpoints correspondientes:
 *  - GET  /api/events/{id}/evidences
 *  - POST /api/events/{id}/evidences
 *  - PUT  /api/events/{id}/complete
 */
export interface IFieldVisitRepository {
  /**
   * Obtiene la lista de evidencias (fotos/videos/documentos) asociadas a un evento.
   * GET /api/events/{eventId}/evidences
   */
  getEvidences(eventId: string): Promise<Evidence[]>;

  /**
   * Agrega una nueva evidencia a un evento.
   * POST /api/events/{eventId}/evidences
   *
   * @param eventId ID del evento al que se asocia la evidencia.
   * @param dto     Datos de la evidencia. La URL debe ser pública (ya subida al Storage).
   */
  addEvidence(eventId: string, dto: CreateEvidenceDTO): Promise<Evidence>;

  /**
   * Marca un evento como completado y asocia las URLs de evidencia.
   * PUT /api/events/{eventId}/complete
   *
   * @param eventId ID del evento a completar.
   * @param dto     DTO con las URLs públicas de evidencias y notas de cierre.
   */
  completeEvent(eventId: string, dto: CompleteEventDTO): Promise<Event>;
}
