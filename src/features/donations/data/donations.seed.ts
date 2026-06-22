/**
 * @file donations.seed.ts
 * @description Datos iniciales de microdonaciones para desarrollo y demostración.
 */
import { MicroDonation } from '../types/donation.types';

export const INITIAL_DONATIONS: MicroDonation[] = [
  {
    id: 'don-1',
    mypeName: 'Bodega "La Capullana"',
    mypeCategory: 'Bodega',
    district: 'Castilla',
    date: '2026-06-01',
    method: 'Especie',
    itemsDonated: [
      { itemName: 'Leche evaporada entera', qty: 15 },
    ],
    eventId: 'ev-1',
    comment: 'Apoyo con mucho cariño de nuestros clientes constantes del asentamiento de El Indio.',
  },
  {
    id: 'don-2',
    mypeName: 'Panificadora de Chulucanas "Don Bosco"',
    mypeCategory: 'Panadería',
    district: 'Chulucanas',
    date: '2026-06-02',
    method: 'Yape',
    amount: 180,
    eventId: 'ev-4',
    comment: 'Microdonación por ventas del fin de semana.',
  },
  {
    id: 'don-3',
    mypeName: 'Farmacia "Piura Medic"',
    mypeCategory: 'Farmacia',
    district: 'Piura Centro',
    date: '2026-06-02',
    method: 'Especie',
    itemsDonated: [
      { itemName: 'Pañales anatómicos para adulto G', qty: 5 },
      { itemName: 'Toallitas húmedas dermo-limpiadoras', qty: 8 },
    ],
    eventId: 'ev-3',
    comment: 'Queremos sumarnos para la atención de nuestros abuelitos.',
  },
];
