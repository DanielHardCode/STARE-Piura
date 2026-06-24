import type { FinancialTransaction, CreateTransactionDTO, FundBalances } from '@/types/index';

export interface ITransactionRepository {
  getAll(): Promise<FinancialTransaction[]>;
  create(dto: CreateTransactionDTO): Promise<FinancialTransaction>;
  getBalances(): Promise<FundBalances>;
}
