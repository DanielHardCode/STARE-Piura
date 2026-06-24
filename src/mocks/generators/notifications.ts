/**
 * @file src/mocks/generators/notifications.ts
 * @description Genera notificaciones ficticias para el sistema con Faker seed fijo.
 */

import { f } from '../seed';
import type { Notification, NotificationType } from '@/types/index';

const TIPOS: NotificationType[] = [
  'donacion_recibida',
  'visita_proxima',
  'bolsa_incompleta',
  'fondo_bajo',
  'evento_actualizado',
  'sistema'
];

const NOTIF_TEMPLATES: Record<NotificationType, { title: string; message: string }[]> = {
  donacion_recibida: [
    { title: 'Nueva donación monetaria', message: 'Se ha recibido una donación de S/. 250.00 vía Yape.' },
    { title: 'Nueva donación en especie', message: 'La MYPE "Bodega Don Pepe" ha donado 5 sacos de arroz.' },
    { title: 'Aporte de donante', message: 'Donante anónimo registró una transferencia por S/. 1,200.00.' }
  ],
  visita_proxima: [
    { title: 'Visita programada pronto', message: 'La visita al Comedor "Santa Rosa" en Catacaos es mañana a las 09:00 AM.' },
    { title: 'Preparación de entrega', message: 'Se aproxima la fecha de entrega para el Asilo de Ancianos.' }
  ],
  bolsa_incompleta: [
    { title: 'Bolsa de suministros incompleta', message: 'Faltan medicinas por cubrir en la bolsa de la visita al Albergue San José.' },
    { title: 'Alerta de cobertura', message: 'El evento del Club de Madres "Virgen del Carmen" tiene cobertura menor al 50%.' }
  ],
  fondo_bajo: [
    { title: 'Fondo de Adquisición bajo', message: 'El saldo del Fondo de Adquisición está por debajo del límite sugerido (S/. 500.00).' },
    { title: 'Caja chica con saldo mínimo', message: 'El saldo de la Caja Chica es menor a S/. 100.00.' }
  ],
  evento_actualizado: [
    { title: 'Visita reprogramada', message: 'El coordinador ha cambiado la hora de la visita al PRONOEI.' },
    { title: 'Detalles modificados', message: 'Se actualizaron las necesidades del comedor "El Porvenir".' }
  ],
  sistema: [
    { title: 'Copia de seguridad exitosa', message: 'Se realizó el respaldo automático de la base de datos local.' },
    { title: 'Actualización de tasas', message: 'Tasas de cambio e inflación local actualizadas.' }
  ]
};

let notifCounter = 1;

function generateNotification(): Notification {
  const tipo = f.helpers.arrayElement(TIPOS);
  const templates = NOTIF_TEMPLATES[tipo];
  const template = f.helpers.arrayElement(templates);
  
  const n = notifCounter++;
  const now = new Date('2026-06-24T16:00:00-05:00'); // current time mock boundary
  const createdDate = new Date(now.getTime() - f.number.int({ min: 1, max: 240 }) * 60000); // from minutes ago to days ago

  return {
    id: `notif-${String(n).padStart(3, '0')}`,
    tipo,
    title: template.title,
    message: template.message,
    read: f.datatype.boolean({ probability: 0.6 }),
    created_at: createdDate.toISOString(),
  };
}

/** 20 notificaciones pre-generadas con seed fijo. */
export const MOCK_NOTIFICATIONS: Notification[] = Array.from({ length: 20 }, generateNotification);
