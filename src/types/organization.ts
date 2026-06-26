export type InterventionType = 'educativa' | 'acompañamiento' | 'infraestructura';
export type EventStatus = 'pendiente' | 'en curso' | 'completado';

export interface Organization {
  id: string;
  nombre: string;
  direccion: string;
  sector_demografico: string; // ej. "Asentamiento Humano", "Vaso de Leche / Comedor Popular", "Colegio Inicial Rural"
  deficiencias_infraestructura: string[]; // ej. "Sin Agua Potable", "Sin Techo Sombreador (Altas Temperaturas PIURA)", "Aulas de caña/madera"
  distrito: string; // Piura districts like Catacaos, Tambogrande, Castilla, Chulucanas, etc.
}

export interface SocialEvent {
  id: string;
  organization_id: string;
  fecha_programada: string;
  tipo_intervencion: InterventionType;
  estado: EventStatus;
  voluntarios_requeridos: number;
}
