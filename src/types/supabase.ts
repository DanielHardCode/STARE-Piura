export interface Profile {
  id: string;
  email: string;
  nombre: string;
  role: 'admin' | 'coordinador' | 'voluntario';
  telefono?: string;
  activo: boolean;
  avatar_url?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  distrito: string;
  telefono?: string;
  encargado: string;
  email?: string;
  beneficiarios_estimados: number;
  necesidades: string[];
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Mype {
  id: string;
  razon_social: string;
  ruc: string;
  rubro: string;
  contacto: string;
  telefono: string;
  email?: string;
  distrito: string;
  activo: boolean;
  historial_aportes: number;
  created_at: string;
}

export interface Donor {
  id: string;
  nombres: string;
  tipo: string;
  documento: string;
  telefono?: string;
  email?: string;
  distrito?: string;
  mype_id?: string;
  created_at: string;
}

export interface Event {
  id: string;
  organization_id?: string;
  organization_nombre?: string;
  title: string;
  description?: string;
  distrito: string;
  target_audience: string;
  start_time: string;
  end_time: string;
  status: string;
  coordinador_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  donor_nombre: string;
  tipo: string;
  medio_pago?: string;
  monto?: number;
  items?: any;
  descripcion?: string;
  fondo_destino?: string;
  event_id?: string;
  comprobante_url?: string;
  fecha: string;
  created_at: string;
}

export interface SupplyItem {
  id: string;
  event_id: string;
  nombre: string;
  categoria: string;
  unidad: string;
  cantidad_requerida: number;
  cantidad_cubierta: number;
  precio_unitario_estimado: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  tipo: string;
  concepto: string;
  monto: number;
  fondo: string;
  fecha: string;
  donation_id?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id?: string;
  tipo: string;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  created_at: string;
}

export type SupplyBagStatus = 'pendiente' | 'entregado';

export interface SupplyBag {
  id: string;
  event_id: string;
  status: SupplyBagStatus;
  contenido?: any;
  created_at: string;
  updated_at: string;
}
