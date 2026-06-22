/**
 * @file donation.types.ts
 * @description Tipos e interfaces de la feature de Microdonaciones.
 */
import { PiuraDistrict } from '../../../shared/types';
import { FundSourceType } from '../../finance/types/finance.types';

export type DonationMethod = 'Yape' | 'Plin' | 'Efectivo_CajaChica' | 'Adquisicion_Directa' | 'Especie';

export interface MicroDonation {
  id: string;
  mypeName: string;
  /** Categoría de la MYPE (ej. "Bodega", "Farmacia", "Panadería"). */
  mypeCategory: string;
  district: PiuraDistrict;
  date: string;
  method: DonationMethod;
  /** Monto monetario en PEN, si aplica. */
  amount?: number;
  /** Ítems donados en especie. */
  itemsDonated?: { itemName: string; qty: number }[];
  /** ID del evento social beneficiario, o 'stock_general'. */
  eventId: string;
  phone?: string;
  ruc?: string;
  txNumber?: string;
  receiptFileName?: string;
  comment?: string;
  /** Fondo de destino para donaciones monetarias. */
  fundDestination?: FundSourceType;
}
