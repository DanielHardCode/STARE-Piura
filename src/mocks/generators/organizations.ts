/**
 * @file src/mocks/generators/organizations.ts
 * @description Genera 50 organizaciones beneficiarias con Faker seed fijo.
 */

import { f } from '../seed';
import type { Organization, OrganizationType, PiuraDistrict } from '@/types/index';

const TIPOS: OrganizationType[] = ['comedor', 'asilo', 'albergue', 'vaso_de_leche', 'pronoei', 'otro'];

const PREFIJOS: Record<OrganizationType, string[]> = {
  comedor:       ['Comedor Popular', 'Olla Común', 'Comedor Comunal'],
  asilo:         ['Asilo de Ancianos', 'Hogar del Adulto Mayor', 'Casa de Reposo'],
  albergue:      ['Albergue', 'Centro de Acogida', 'Refugio'],
  vaso_de_leche: ['Club de Madres', 'Vaso de Leche', 'Programa VAL'],
  pronoei:       ['PRONOEI', 'Centro Inicial', 'Jardín de Niños'],
  otro:          ['Asociación', 'Centro Comunitario', 'Club Social'],
};

const NOMBRES_PROPIOS = [
  'Santa Rosa', 'Virgen del Carmen', 'San Martín', 'Los Jardines', 'El Porvenir',
  'Las Américas', 'Señor de los Milagros', 'Santa Ana', 'Cristo Rey', 'San Francisco',
  'La Merced', 'Santa Catalina', 'San José', 'El Nazareno', 'Sagrado Corazón',
  'San Pedro', 'Divina Misericordia', 'Jesús de Nazareth', 'Los Algarrobos', 'Villa Rica',
  'Nueva Esperanza', 'Los Pinos', 'Bella Vista', 'El Palmar', 'Los Molinos',
];

const DISTRITOS: PiuraDistrict[] = [
  'Piura Centro', 'Catacaos', 'Castilla', 'Veintiséis de Octubre',
  'Sullana', 'Chulucanas', 'Sechura', 'Paita', 'Talara', 'Tambogrande',
];

const NECESIDADES = [
  'Víveres', 'Medicamentos', 'Abrigo', 'Útiles escolares', 'Artículos de limpieza',
  'Pañales', 'Leche fórmula', 'Sillas de ruedas', 'Colchones', 'Ropa', 'Calzado',
];

let orgCounter = 1;

function generateOrganization(): Organization {
  const tipo = f.helpers.arrayElement(TIPOS);
  const prefijo = f.helpers.arrayElement(PREFIJOS[tipo]);
  const nombre_propio = f.helpers.arrayElement(NOMBRES_PROPIOS);
  const distrito = f.helpers.arrayElement(DISTRITOS);

  const n = orgCounter++;
  const now = new Date('2026-01-01T00:00:00-05:00');
  const createdDate = new Date(now.getTime() - f.number.int({ min: 30, max: 365 }) * 86400000);

  return {
    id: `org-${String(n).padStart(3, '0')}`,
    nombre: `${prefijo} "${nombre_propio}"`,
    tipo,
    direccion: `${f.location.streetAddress()}, ${distrito}`,
    distrito,
    telefono: `9${f.string.numeric(8)}`,
    encargado: f.person.fullName(),
    email: f.helpers.maybe(() => f.internet.email(), { probability: 0.4 }),
    beneficiarios_estimados: f.number.int({ min: 15, max: 200 }),
    necesidades: f.helpers.arrayElements(NECESIDADES, { min: 2, max: 5 }),
    activo: f.datatype.boolean({ probability: 0.9 }),
    created_at: createdDate.toISOString(),
    updated_at: new Date(createdDate.getTime() + f.number.int({ min: 0, max: 30 }) * 86400000).toISOString(),
  };
}

/** 50 organizaciones beneficiarias pre-generadas con seed fijo. */
export const MOCK_ORGANIZATIONS: Organization[] = Array.from({ length: 50 }, generateOrganization);
