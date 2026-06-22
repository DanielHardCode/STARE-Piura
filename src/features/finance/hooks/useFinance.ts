/**
 * @file useFinance.ts
 * @description Hook de gestión del estado financiero (fondos y kardex de movimientos).
 */
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { BalanceMovement, FundBalances, FundSourceType } from '../types/finance.types';
import { INITIAL_MOVEMENTS, INITIAL_BALANCES } from '../data/finance.seed';
import { SIMULATED_TODAY } from '../../../shared/constants/districts.constants';

export function useFinance() {
  const [movements, setMovements] = useLocalStorage<BalanceMovement[]>('stare_movements', INITIAL_MOVEMENTS);
  const [balances, setBalances] = useLocalStorage<FundBalances>('stare_balances', INITIAL_BALANCES);

  /**
   * Registra un movimiento de ingreso o egreso y actualiza el saldo del fondo correspondiente.
   */
  const addTransaction = (
    fund: FundSourceType,
    type: 'ingreso' | 'egreso',
    amount: number,
    description: string,
    method: string
  ): BalanceMovement => {
    const newMovement: BalanceMovement = {
      id: `mov-${Date.now()}`,
      amount,
      type,
      fund,
      description,
      date: SIMULATED_TODAY,
      method,
    };

    setMovements(prev => [newMovement, ...prev]);

    setBalances(prev => {
      const change = type === 'ingreso' ? amount : -amount;
      if (fund === 'caja_chica') {
        return { ...prev, cajaChica: Math.max(0, prev.cajaChica + change) };
      }
      return { ...prev, fondoAdquisicion: Math.max(0, prev.fondoAdquisicion + change) };
    });

    return newMovement;
  };

  /**
   * Descuenta del fondo de adquisición el costo de una compra directa de ítem.
   */
  const deductFromAcquisitionFund = (cost: number, description: string): BalanceMovement => {
    return addTransaction('fondo_adquisicion', 'egreso', cost, description, 'Adquisición Compensatoria');
  };

  return {
    movements,
    balances,
    addTransaction,
    deductFromAcquisitionFund,
  };
}
