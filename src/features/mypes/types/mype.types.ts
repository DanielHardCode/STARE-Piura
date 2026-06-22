/**
 * @file mype.types.ts
 * @description Tipos e interfaces de la feature de directorio MYPE.
 */
import { PiuraDistrict } from '../../../shared/types';

export interface MypeProfile {
  id: string;
  name: string;
  ruc: string;
  phone: string;
  district: PiuraDistrict;
  /** Categoría de negocio (ej. "Bodega", "Panadería"). */
  category: string;
  contactPerson: string;
  registeredAt: string;
}
