/**
 * @file src/mocks/generators/donors.ts
 * @description Genera 200 donantes con Faker seed fijo.
 */

import { f } from '../seed';
import type { Donor, DonorType, PiuraDistrict } from '@/types/index';
import { MOCK_MYPES } from './mypes';

const DISTRITOS: PiuraDistrict[] = [
  'Piura Centro', 'Catacaos', 'Castilla', 'Veintiséis de Octubre',
  'Sullana', 'Chulucanas', 'Sechura', 'Paita', 'Talara', 'Tambogrande',
];

let donorCounter = 1;

function generateDonor(): Donor {
  const tipo: DonorType = f.helpers.weightedArrayElement([
    { weight: 6, value: 'persona_natural' },
    { weight: 4, value: 'empresa' },
  ]);
  const n = donorCounter++;
  const mype = tipo === 'empresa' ? f.helpers.maybe(() => f.helpers.arrayElement(MOCK_MYPES), { probability: 0.7 }) : undefined;

  return {
    id: `donor-${String(n).padStart(3, '0')}`,
    nombres: tipo === 'persona_natural'
      ? f.person.fullName()
      : (mype?.razon_social ?? f.company.name()),
    tipo,
    documento: tipo === 'persona_natural'
      ? f.string.numeric(8)
      : f.string.numeric(11),
    telefono: f.helpers.maybe(() => `9${f.string.numeric(8)}`, { probability: 0.8 }),
    email: f.helpers.maybe(() => f.internet.email(), { probability: 0.5 }),
    distrito: f.helpers.arrayElement(DISTRITOS),
    mype_id: mype?.id,
    created_at: new Date(
      new Date('2025-06-01').getTime() + f.number.int({ min: 0, max: 365 }) * 86400000
    ).toISOString(),
  };
}

/** 200 donantes pre-generados con seed fijo. */
export const MOCK_DONORS: Donor[] = Array.from({ length: 200 }, generateDonor);
