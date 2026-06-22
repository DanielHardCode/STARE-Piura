/**
 * @file finance.seed.ts
 * @description Datos iniciales de movimientos y balances financieros para desarrollo.
 */
import { BalanceMovement, FundBalances } from '../types/finance.types';

export const INITIAL_MOVEMENTS: BalanceMovement[] = [
  {
    id: 'mov-1',
    amount: 180.00,
    type: 'ingreso',
    fund: 'fondo_adquisicion',
    description: 'Donación digital vía Yape de Panificadora Don Bosco',
    date: '2026-06-02',
    method: 'Yape',
  },
  {
    id: 'mov-2',
    amount: 120.00,
    type: 'egreso',
    fund: 'caja_chica',
    description: 'Pago de combustible y flete de Mototaxi de Piura a Catacaos para traslado de donativos',
    date: '2026-06-02',
    method: 'Efectivo',
  },
  {
    id: 'mov-3',
    amount: 50.00,
    type: 'egreso',
    fund: 'caja_chica',
    description: 'Útiles de oficina y fotocopias de fichas de control de beneficiarios',
    date: '2026-06-01',
    method: 'Efectivo',
  },
];

export const INITIAL_BALANCES: FundBalances = {
  /** Caja chica: para logística local y transporte. */
  cajaChica: 430.00,
  /** Fondo de adquisición: para compra directa de materiales faltantes. */
  fondoAdquisicion: 1480.00,
};
