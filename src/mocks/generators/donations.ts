/**
 * @file src/mocks/generators/donations.ts
 * @description Genera 300 donaciones con Faker seed fijo.
 * Mix: 60% monetarias, 40% en especie.
 */

import { f } from '../seed';
import type { Donation, DonationType, DonationMethod, FundType } from '@/types/index';
import { MOCK_DONORS } from './donors';
import { MOCK_EVENTS } from './events';

const CONCEPTOS_ESPECIE = [
  'Víveres de primera necesidad', 'Medicamentos genéricos', 'Ropa y abrigo',
  'Útiles escolares', 'Artículos de limpieza', 'Pañales y toallitas',
  'Leche y fórmulas', 'Conservas alimenticias', 'Colchones y frazadas',
];

let donationCounter = 1;

function generateDonation(): Donation {
  const n = donationCounter++;
  const donor = f.helpers.arrayElement(MOCK_DONORS);
  const tipo: DonationType = f.helpers.weightedArrayElement([
    { weight: 6, value: 'monetaria' },
    { weight: 4, value: 'especie' },
  ]);

  const eventOrNull = f.helpers.maybe(() => f.helpers.arrayElement(MOCK_EVENTS), { probability: 0.7 });

  // Fecha aleatoria en los últimos 6 meses
  const fecha = new Date(
    new Date('2026-06-24').getTime() - f.number.int({ min: 0, max: 180 }) * 86400000
  );

  if (tipo === 'monetaria') {
    const medio_pago: DonationMethod = f.helpers.weightedArrayElement([
      { weight: 4, value: 'yape' },
      { weight: 2, value: 'plin' },
      { weight: 2, value: 'efectivo' },
      { weight: 2, value: 'transferencia' },
    ]);
    const fondo_destino: FundType = f.helpers.weightedArrayElement([
      { weight: 6, value: 'fondo_adquisicion' },
      { weight: 4, value: 'caja_chica' },
    ]);
    const monto = f.number.float({ min: 20, max: 2500, fractionDigits: 2 });

    return {
      id: `don-${String(n).padStart(3, '0')}`,
      donor_id: donor.id,
      donor_nombre: donor.nombres,
      tipo: 'monetaria',
      medio_pago,
      monto,
      fondo_destino,
      event_id: eventOrNull?.id,
      descripcion: `Donación ${medio_pago} de ${donor.nombres}`,
      fecha: fecha.toISOString().split('T')[0],
      created_at: fecha.toISOString(),
    };
  } else {
    const itemCount = f.number.int({ min: 1, max: 4 });
    const items = Array.from({ length: itemCount }, () => ({
      item_nombre: f.helpers.arrayElement(CONCEPTOS_ESPECIE),
      cantidad: f.number.int({ min: 5, max: 80 }),
      unidad: f.helpers.arrayElement(['unidades', 'kg', 'bolsas', 'cajas', 'paquetes']),
    }));

    return {
      id: `don-${String(n).padStart(3, '0')}`,
      donor_id: donor.id,
      donor_nombre: donor.nombres,
      tipo: 'especie',
      items,
      event_id: eventOrNull?.id,
      descripcion: `Donación en especie de ${donor.nombres}`,
      fecha: fecha.toISOString().split('T')[0],
      created_at: fecha.toISOString(),
    };
  }
}

/** 300 donaciones pre-generadas con seed fijo. */
export const MOCK_DONATIONS: Donation[] = Array.from({ length: 300 }, generateDonation);
