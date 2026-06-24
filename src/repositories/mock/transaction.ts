import type { ITransactionRepository } from '../contracts/transaction';
import type { FinancialTransaction, CreateTransactionDTO, FundBalances } from '@/types/index';
import { MOCK_TRANSACTIONS, calculateFundBalances } from '@/mocks';
import { delay } from './utils';

export class MockTransactionRepository implements ITransactionRepository {
  private static items: FinancialTransaction[] = [...MOCK_TRANSACTIONS];

  async getAll(): Promise<FinancialTransaction[]> {
    await delay();
    return [...MockTransactionRepository.items];
  }

  async create(dto: CreateTransactionDTO): Promise<FinancialTransaction> {
    await delay();
    const id = `tx-${String(MockTransactionRepository.items.length + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newItem: FinancialTransaction = {
      id,
      tipo: dto.tipo,
      concepto: dto.concepto,
      monto: dto.monto,
      fondo: dto.fondo,
      fecha: dto.fecha || now.split('T')[0],
      donation_id: dto.donation_id,
      created_at: now,
    };
    MockTransactionRepository.items.push(newItem);
    return { ...newItem };
  }

  async getBalances(): Promise<FundBalances> {
    await delay();
    return calculateFundBalances(MockTransactionRepository.items);
  }
}
