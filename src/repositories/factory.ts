/**
 * @file src/repositories/factory.ts
 * @description Fábrica de repositorios de la aplicación.
 * Retorna las instancias de repositorios Mock o de producción de acuerdo
 * al DataProvider configurado.
 */

import { isMockMode } from '@/lib/config';
import type {
  IOrganizationRepository,
  IMypeRepository,
  IDonorRepository,
  IDonationRepository,
  IEventRepository,
  ITransactionRepository,
  INotificationRepository
} from './contracts';

import {
  MockOrganizationRepository,
  MockMypeRepository,
  MockDonorRepository,
  MockDonationRepository,
  MockEventRepository,
  MockTransactionRepository,
  MockNotificationRepository
} from './mock';

export interface Repositories {
  organizations: IOrganizationRepository;
  mypes: IMypeRepository;
  donors: IDonorRepository;
  donations: IDonationRepository;
  events: IEventRepository;
  transactions: ITransactionRepository;
  notifications: INotificationRepository;
}

let cachedRepositories: Repositories | null = null;

export function getRepositories(): Repositories {
  if (cachedRepositories) {
    return cachedRepositories;
  }

  if (isMockMode) {
    cachedRepositories = {
      organizations: new MockOrganizationRepository(),
      mypes: new MockMypeRepository(),
      donors: new MockDonorRepository(),
      donations: new MockDonationRepository(),
      events: new MockEventRepository(),
      transactions: new MockTransactionRepository(),
      notifications: new MockNotificationRepository(),
    };
  } else {
    // Temporalmente lanzamos error hasta que implementemos la integración con Supabase/Laravel en fases posteriores.
    throw new Error(
      'El proveedor de datos de Supabase + Laravel aún no está implementado. Por favor, asegúrese de usar VITE_DATA_PROVIDER=mock en su archivo .env'
    );
  }

  return cachedRepositories;
}
