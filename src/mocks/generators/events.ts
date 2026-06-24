/**
 * @file src/mocks/generators/events.ts
 * @description Genera 150 eventos/visitas distribuidos en los próximos 3 meses con Faker seed fijo.
 * Incluye eventos pasados (realizados/cancelados) y futuros (programados/en_curso).
 */

import { f } from '../seed';
import type { Event, EventStatus, PiuraDistrict } from '@/types/index';
import { MOCK_ORGANIZATIONS } from './organizations';

const DISTRITOS: PiuraDistrict[] = [
  'Piura Centro', 'Catacaos', 'Castilla', 'Veintiséis de Octubre',
  'Sullana', 'Chulucanas', 'Sechura', 'Paita', 'Talara', 'Tambogrande',
];

const EVENT_TEMPLATES = [
  { prefix: 'Apoyo Nutricional en', audience: 'Niños de 3 a 5 años' },
  { prefix: 'Campaña Solidaria en', audience: 'Familias vulnerables' },
  { prefix: 'Jornada Médica en', audience: 'Adultos mayores internados' },
  { prefix: 'Distribución de Víveres en', audience: 'Beneficiarios del programa' },
  { prefix: 'Entrega de Kits de Higiene en', audience: 'Madres gestantes y lactantes' },
  { prefix: 'Compartir Navideño en', audience: 'Niños de la comunidad' },
  { prefix: 'Campaña contra la Anemia en', audience: 'Niños menores de 5 años' },
  { prefix: 'Apoyo Escolar en', audience: 'Estudiantes de primaria' },
  { prefix: 'Visita de Asistencia Social a', audience: 'Población en riesgo' },
  { prefix: 'Jornada de Atención Geriátrica en', audience: 'Adultos mayores de 70 años' },
];

const BASE_DATE = new Date('2026-06-24T00:00:00-05:00');

let eventCounter = 1;

function generateEvent(): Event {
  const n = eventCounter++;
  const org = f.helpers.maybe(() => f.helpers.arrayElement(MOCK_ORGANIZATIONS), { probability: 0.8 });
  const template = f.helpers.arrayElement(EVENT_TEMPLATES);
  const distrito = org?.distrito ?? f.helpers.arrayElement(DISTRITOS);

  // Distribución: 40% pasados, 60% futuros (próximos 3 meses)
  const isPast = f.datatype.boolean({ probability: 0.4 });
  const dayOffset = isPast
    ? f.number.int({ min: -90, max: -1 })
    : f.number.int({ min: 0, max: 90 });

  const startDate = new Date(BASE_DATE.getTime() + dayOffset * 86400000);
  const durationHours = f.number.int({ min: 2, max: 8 });
  const endDate = new Date(startDate.getTime() + durationHours * 3600000);

  let status: EventStatus;
  if (isPast) {
    status = f.helpers.weightedArrayElement([
      { weight: 8, value: 'realizada' },
      { weight: 2, value: 'cancelada' },
    ]);
  } else if (dayOffset === 0) {
    status = 'en_curso';
  } else {
    status = 'programada';
  }

  const orgName = org?.nombre ?? `Institución de ${distrito}`;
  const title = `${template.prefix} ${orgName}`;

  const now = new Date().toISOString();

  return {
    id: `event-${String(n).padStart(3, '0')}`,
    organization_id: org?.id,
    organization_nombre: org?.nombre,
    title,
    description: f.lorem.sentence({ min: 8, max: 20 }),
    distrito,
    target_audience: `${f.number.int({ min: 15, max: 180 })} ${template.audience}`,
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
    status,
    coordinador_id: 'user-001',
    notes: f.helpers.maybe(() => f.lorem.sentence({ min: 5, max: 15 }), { probability: 0.4 }),
    created_at: new Date(startDate.getTime() - f.number.int({ min: 3, max: 30 }) * 86400000).toISOString(),
    updated_at: now,
  };
}

/** 150 eventos pre-generados con seed fijo. */
export const MOCK_EVENTS: Event[] = Array.from({ length: 150 }, generateEvent);
