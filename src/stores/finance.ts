import { create } from 'zustand';
import type { FinancialTransaction, CreateTransactionDTO, FundBalances, DashboardKPIs } from '@/types/index';
import { financeService } from '@/services/finance';

interface FinanceState {
  transactions: FinancialTransaction[];
  balances: FundBalances;
  kpis: DashboardKPIs | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  fetchKPIs: () => Promise<void>;
  addTransaction: (dto: CreateTransactionDTO) => Promise<FinancialTransaction>;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  balances: { caja_chica: 0, fondo_adquisicion: 0 },
  kpis: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await financeService.getTransactions();
      set({ transactions: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener transacciones', loading: false });
    }
  },

  fetchBalances: async () => {
    set({ loading: true, error: null });
    try {
      const data = await financeService.getBalances();
      set({ balances: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener saldos', loading: false });
    }
  },

  fetchKPIs: async () => {
    set({ loading: true, error: null });
    try {
      const data = await financeService.getDashboardKPIs();
      set({ kpis: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Error al obtener KPIs', loading: false });
    }
  },

  addTransaction: async (dto) => {
    set({ loading: true, error: null });
    try {
      const newItem = await financeService.createTransaction(dto);
      
      // Volver a calcular saldos y KPIs tras registrar un movimiento
      const [newBalances, newKpis] = await Promise.all([
        financeService.getBalances(),
        financeService.getDashboardKPIs(),
      ]);

      set((state) => ({
        transactions: [newItem, ...state.transactions],
        balances: newBalances,
        kpis: newKpis,
        loading: false,
      }));

      return newItem;
    } catch (err: any) {
      set({ error: err.message || 'Error al agregar transacción', loading: false });
      throw err;
    }
  },
}));
