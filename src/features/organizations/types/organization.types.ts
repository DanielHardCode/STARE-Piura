/**
 * @file organization.types.ts
 * @description Tipos e interfaces de la feature de Organizaciones Beneficiarias.
 * Nota: SocialEvent aquí se refiere al evento de intervención de una organización
 * (diferente de SocialEvent en features/events/ que es el evento de entrega de bolsas).
 */

export type InterventionType = 'educativa' | 'acompañamiento' | 'infraestructura';
export type OrgEventStatus = 'pendiente' | 'en curso' | 'completado';

export interface Organization {
  id: string;
  nombre: string;
  direccion: string;
  /** Sector demográfico atendido (ej. "Comedor Popular / Madres de Familia"). */
  sector_demografico: string;
  /** Lista de deficiencias detectadas (ej. "Sin Agua Potable"). */
  deficiencias_infraestructura: string[];
  /** Distrito de Piura donde se ubica la organización. */
  distrito: string;
}

export interface OrgSocialEvent {
  id: string;
  organization_id: string;
  fecha_programada: string;
  tipo_intervencion: InterventionType;
  estado: OrgEventStatus;
  voluntarios_requeridos: number;
}
