/**
 * @file finance.types.ts
 * @description Tipos e interfaces de la feature financiera (fondos y kardex).
 */

export type MovementType = 'ingreso' | 'egreso';
export type FundSourceType = 'caja_chica' | 'fondo_adquisicion';

export interface BalanceMovement {
  id: string;
  amount: number;
  type: MovementType;
  fund: FundSourceType;
  description: string;
  date: string;
  method: string;
}

export interface FundBalances {
  cajaChica: number;
  fondoAdquisicion: number;
}
