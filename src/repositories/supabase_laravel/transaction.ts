/**
 * @file src/repositories/supabase_laravel/transaction.ts
 * @description Repositorio de Transacciones Financieras para el provider `supabase_laravel`.
 *
 * Endpoints cubiertos:
 *  - GET  /api/transactions
 *  - POST /api/transactions
 *  - GET  /api/balances
 */

import { apiGet, apiPost } from '@/lib/api-client';
import type { ITransactionRepository } from '../contracts/transaction';
import type { FinancialTransaction, CreateTransactionDTO, FundBalances } from '@/types/index';

export class SupabaseLaravelTransactionRepository implements ITransactionRepository {
  /**
   * Obtiene la lista completa de transacciones financieras (kardex).
   * El backend las retorna ordenadas por fecha descendente.
   */
  async getAll(): Promise<FinancialTransaction[]> {
    return apiGet<FinancialTransaction[]>('/api/transactions');
  }

  /**
   * Registra una nueva transacción en el kardex.
   * @param dto Datos del movimiento (ingreso o egreso).
   * @returns La transacción creada con ID y timestamp asignados por el servidor.
   */
  async create(dto: CreateTransactionDTO): Promise<FinancialTransaction> {
    return apiPost<FinancialTransaction>('/api/transactions', dto);
  }

  /**
   * Obtiene los saldos actuales de los dos fondos del sistema.
   * @returns Objeto con saldo de `caja_chica` y `fondo_adquisicion` en PEN.
   */
  async getBalances(): Promise<FundBalances> {
    return apiGet<FundBalances>('/api/balances');
  }
}
