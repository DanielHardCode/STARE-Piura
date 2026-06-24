/**
 * @file src/mocks/generators/mypes.ts
 * @description Genera 30 MYPEs aliadas con Faker seed fijo.
 */

import { f } from '../seed';
import type { Mype, MypeRubro, PiuraDistrict } from '@/types/index';

const RUBROS: MypeRubro[] = ['Bodega', 'Panadería', 'Farmacia', 'Restaurant', 'Ferretería', 'Librería', 'Textil', 'Otro'];

const DISTRITOS: PiuraDistrict[] = [
  'Piura Centro', 'Catacaos', 'Castilla', 'Veintiséis de Octubre',
  'Sullana', 'Chulucanas', 'Sechura', 'Paita', 'Talara', 'Tambogrande',
];

const NOMBRES_COMERCIALES = [
  'La Capullana', 'El Norteño', 'Don Bosco', 'Los Algarrobos', 'La Perla',
  'El Buen Samaritano', 'La Esperanza', 'Don Manuel', 'Piura Medic', 'El Progreso',
  'La Unión', 'San Antonio', 'El Paraíso', 'Los Compadres', 'La Victoria',
  'El Palmar', 'La Granja', 'Don Pedro', 'Santa Lucía', 'El Triunfo',
];

let mypeCounter = 1;

function generateMype(): Mype {
  const rubro = f.helpers.arrayElement(RUBROS);
  const nombre = f.helpers.arrayElement(NOMBRES_COMERCIALES);
  const n = mypeCounter++;

  const rubroLabel: Record<MypeRubro, string> = {
    Bodega:      'Bodega',
    Panadería:   'Panificadora',
    Farmacia:    'Farmacia',
    Restaurant:  'Restaurant',
    Ferretería:  'Ferretería',
    Librería:    'Librería',
    Textil:      'Distribuidora Textil',
    Otro:        'Negocio',
  };

  return {
    id: `mype-${String(n).padStart(3, '0')}`,
    razon_social: `${rubroLabel[rubro]} "${nombre}"`,
    ruc: f.helpers.arrayElement(['10', '20']) + f.string.numeric(9),
    rubro,
    contacto: f.person.fullName(),
    telefono: `9${f.string.numeric(8)}`,
    email: f.helpers.maybe(() => f.internet.email(), { probability: 0.5 }),
    distrito: f.helpers.arrayElement(DISTRITOS),
    activo: f.datatype.boolean({ probability: 0.92 }),
    historial_aportes: f.number.float({ min: 0, max: 3500, fractionDigits: 2 }),
    created_at: new Date(
      new Date('2026-01-01').getTime() - f.number.int({ min: 10, max: 300 }) * 86400000
    ).toISOString(),
  };
}

/** 30 MYPEs aliadas pre-generadas con seed fijo. */
export const MOCK_MYPES: Mype[] = Array.from({ length: 30 }, generateMype);
