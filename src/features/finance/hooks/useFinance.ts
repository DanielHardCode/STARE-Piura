import { useFinanceStore } from '@/stores/finance';
import { BalanceMovement, FundBalances, FundSourceType } from '../types/finance.types';

export function useFinance() {
  const {
    transactions: storeTransactions,
    balances: storeBalances,
    addTransaction: storeAddTransaction,
    fetchTransactions,
    fetchBalances,
  } = useFinanceStore();

  // Adapter Pattern: Mapear transacciones de Zustand al tipo BalanceMovement de UI
  const movements: BalanceMovement[] = storeTransactions.map((tx) => ({
    id: tx.id,
    amount: tx.monto,
    type: tx.tipo as any,
    fund: tx.fondo as any,
    description: tx.concepto,
    date: tx.fecha,
    method: tx.donation_id ? 'Transferencia' : 'Efectivo',
  }));

  const balances: FundBalances = {
    cajaChica: storeBalances.caja_chica,
    fondoAdquisicion: storeBalances.fondo_adquisicion,
  };

  /**
   * Registra un movimiento de ingreso o egreso y actualiza el saldo del fondo correspondiente.
   */
  const addTransaction = async (
    fund: FundSourceType,
    type: 'ingreso' | 'egreso',
    amount: number,
    description: string,
    method: string
  ): Promise<BalanceMovement> => {
    const tx = await storeAddTransaction({
      tipo: type,
      concepto: description,
      monto: amount,
      fondo: fund,
      fecha: new Date().toISOString().split('T')[0],
    });

    return {
      id: tx.id,
      amount: tx.monto,
      type: tx.tipo as any,
      fund: tx.fondo as any,
      description: tx.concepto,
      date: tx.fecha,
      method,
    };
  };

  /**
   * Descuenta del fondo de adquisición el costo de una compra directa de ítem.
   */
  const deductFromAcquisitionFund = async (cost: number, description: string): Promise<BalanceMovement> => {
    return await addTransaction('fondo_adquisicion', 'egreso', cost, description, 'Adquisición Compensatoria');
  };

  return {
    movements,
    balances,
    addTransaction,
    deductFromAcquisitionFund,
    fetchTransactions,
    fetchBalances,
  };
}
