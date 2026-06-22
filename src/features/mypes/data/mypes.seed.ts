/**
 * @file mypes.seed.ts
 * @description Datos iniciales del directorio de MYPEs para desarrollo y demostración.
 */
import { MypeProfile } from '../types/mype.types';

export const INITIAL_MYPES: MypeProfile[] = [
  {
    id: 'mype-1',
    name: 'Bodega "La Capullana"',
    ruc: '10452367412',
    phone: '968532145',
    district: 'Castilla',
    category: 'Bodega',
    contactPerson: 'Sra. Juana Capullana',
    registeredAt: '2026-06-01',
  },
  {
    id: 'mype-2',
    name: 'Panificadora de Chulucanas "Don Bosco"',
    ruc: '20452399124',
    phone: '955321478',
    district: 'Chulucanas',
    category: 'Panadería',
    contactPerson: 'Don Bosco Chulucanas',
    registeredAt: '2026-06-02',
  },
  {
    id: 'mype-3',
    name: 'Farmacia "Piura Medic"',
    ruc: '20124578963',
    phone: '978512356',
    district: 'Piura Centro',
    category: 'Farmacia',
    contactPerson: 'Dr. Alejandro Piura',
    registeredAt: '2026-06-02',
  },
];
