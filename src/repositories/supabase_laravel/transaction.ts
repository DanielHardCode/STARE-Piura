import type { ITransactionRepository } from '../contracts/transaction';
import type { FinancialTransaction, CreateTransactionDTO, FundBalances } from '@/types/index';
import { supabase } from '@/lib/supabase';
import { laravelApi } from '@/lib/laravel';

export class SupabaseLaravelTransactionRepository implements ITransactionRepository {
  private get client() {
    if (!supabase) {
      throw new Error('Supabase no está inicializado.');
    }
    return supabase;
  }

  async getAll(): Promise<FinancialTransaction[]> {
    const { data, error } = await this.client
      .from('transactions')
      .select('*')
      .order('fecha', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error al obtener transacciones de Supabase: ${error.message}`);
    }

    return (data || []) as FinancialTransaction[];
  }

  async create(dto: CreateTransactionDTO): Promise<FinancialTransaction> {
    return laravelApi.post<FinancialTransaction>('/transactions', dto);
  }

  async getBalances(): Promise<FundBalances> {
    return laravelApi.get<FundBalances>('/balances');
  }
}
