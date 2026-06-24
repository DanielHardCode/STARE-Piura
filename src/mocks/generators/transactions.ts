/**
 * @file src/mocks/generators/transactions.ts
 * @description Genera 500 movimientos financieros del kardex con Faker seed fijo.
 * Incluye patrones realistas: más ingresos al inicio del mes, egresos distribuidos.
 */

import { f } from '../seed';
import type { FinancialTransaction, FundType, MovementType } from '@/types/index';
import { MOCK_DONATIONS } from './donations';

const CONCEPTOS_EGRESO = [
  'Pago de combustible y transporte logístico',
  'Compra de insumos para evento de visita',
  'Útiles de oficina y fotocopias',
  'Pago de flete y mototaxi de campo',
  'Impresión de fichas y formularios de control',
  'Compra de agua para coordinadores',
  'Pago de pasajes terrestres inter-distritales',
  'Mantenimiento de equipo de campo',
  'Adquisición de materiales de embalaje',
  'Gastos de comunicación (recargas de celular)',
  'Compra de productos víveres faltantes en bolsa',
  'Pago de servicio de carga y descarga',
  'Adquisición de medicina de urgencia',
];

let txCounter = 1;

function generateTransaction(): FinancialTransaction {
  const n = txCounter++;

  // 65% ingresos (donaciones), 35% egresos (operativos)
  const tipo: MovementType = f.helpers.weightedArrayElement([
    { weight: 65, value: 'ingreso' },
    { weight: 35, value: 'egreso' },
  ]);

  const fondo: FundType = f.helpers.weightedArrayElement([
    { weight: 55, value: 'fondo_adquisicion' },
    { weight: 45, value: 'caja_chica' },
  ]);

  const fecha = new Date(
    new Date('2026-06-24').getTime() - f.number.int({ min: 0, max: 180 }) * 86400000
  );

  // Vincular ingresos a donaciones monetarias existentes con cierta probabilidad
  const linkedDonation = tipo === 'ingreso'
    ? f.helpers.maybe(() => f.helpers.arrayElement(MOCK_DONATIONS.filter(d => d.tipo === 'monetaria')), { probability: 0.6 })
    : undefined;

  const monto = tipo === 'ingreso'
    ? (linkedDonation?.monto ?? f.number.float({ min: 50, max: 2000, fractionDigits: 2 }))
    : f.number.float({ min: 10, max: 600, fractionDigits: 2 });

  const concepto = tipo === 'ingreso'
    ? `Ingreso: ${linkedDonation ? `Donación de ${linkedDonation.donor_nombre}` : 'Aporte recibido de donante'}`
    : f.helpers.arrayElement(CONCEPTOS_EGRESO);

  return {
    id: `tx-${String(n).padStart(4, '0')}`,
    tipo,
    concepto,
    monto,
    fondo,
    fecha: fecha.toISOString().split('T')[0],
    donation_id: linkedDonation?.id,
    created_at: fecha.toISOString(),
  };
}

/** 500 movimientos financieros pre-generados con seed fijo. */
export const MOCK_TRANSACTIONS: FinancialTransaction[] = Array.from({ length: 500 }, generateTransaction);

/** Calcula saldos actuales a partir de los movimientos. */
export function calculateFundBalances(transactions: FinancialTransaction[]) {
  return transactions.reduce(
    (acc, tx) => {
      const delta = tx.tipo === 'ingreso' ? tx.monto : -tx.monto;
      if (tx.fondo === 'caja_chica') {
        acc.caja_chica = Math.max(0, acc.caja_chica + delta);
      } else {
        acc.fondo_adquisicion = Math.max(0, acc.fondo_adquisicion + delta);
      }
      return acc;
    },
    { caja_chica: 0, fondo_adquisicion: 0 }
  );
}

/** Saldos iniciales calculados desde los movimientos mock. */
export const MOCK_FUND_BALANCES = calculateFundBalances(MOCK_TRANSACTIONS);
