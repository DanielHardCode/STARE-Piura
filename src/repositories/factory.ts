/**
 * @file src/repositories/factory.ts
 * @description Fábrica de repositorios de la aplicación.
 * Retorna las instancias de repositorios de acuerdo al DataProvider configurado:
 *   - 'mock'            → datos falsos sin conexión
 *   - 'supabase'        → operaciones directas a Supabase (lectura/escritura)
 *   - 'supabase_laravel' → lecturas desde Supabase, escrituras vía API Laravel
 */

import { config } from '@/lib/config';
import type { DataProvider } from '@/lib/config';
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

import {
  SupabaseLaravelOrganizationRepository,
  SupabaseLaravelMypeRepository,
  SupabaseLaravelDonorRepository,
  SupabaseLaravelDonationRepository,
  SupabaseLaravelEventRepository,
  SupabaseLaravelTransactionRepository,
  SupabaseLaravelNotificationRepository
} from './supabase_laravel';

import {
  SupabaseOrganizationRepository,
  SupabaseMypeRepository,
  SupabaseDonorRepository,
  SupabaseDonationRepository,
  SupabaseEventRepository,
  SupabaseTransactionRepository,
  SupabaseNotificationRepository
} from './supabase';

export interface Repositories {
  organizations: IOrganizationRepository;
  mypes: IMypeRepository;
  donors: IDonorRepository;
  donations: IDonationRepository;
  events: IEventRepository;
  transactions: ITransactionRepository;
  notifications: INotificationRepository;
}

const PROVIDER_MAP: Record<DataProvider, Repositories> = {
  mock: {
    organizations: new MockOrganizationRepository(),
    mypes: new MockMypeRepository(),
    donors: new MockDonorRepository(),
    donations: new MockDonationRepository(),
    events: new MockEventRepository(),
    transactions: new MockTransactionRepository(),
    notifications: new MockNotificationRepository(),
  },
  supabase: {
    organizations: new SupabaseOrganizationRepository(),
    mypes: new SupabaseMypeRepository(),
    donors: new SupabaseDonorRepository(),
    donations: new SupabaseDonationRepository(),
    events: new SupabaseEventRepository(),
    transactions: new SupabaseTransactionRepository(),
    notifications: new SupabaseNotificationRepository(),
  },
  supabase_laravel: {
    organizations: new SupabaseLaravelOrganizationRepository(),
    mypes: new SupabaseLaravelMypeRepository(),
    donors: new SupabaseLaravelDonorRepository(),
    donations: new SupabaseLaravelDonationRepository(),
    events: new SupabaseLaravelEventRepository(),
    transactions: new SupabaseLaravelTransactionRepository(),
    notifications: new SupabaseLaravelNotificationRepository(),
  },
};

let cachedRepositories: Repositories | null = null;

export function getRepositories(): Repositories {
  if (cachedRepositories) {
    return cachedRepositories;
  }

  cachedRepositories = PROVIDER_MAP[config.dataProvider];

  return cachedRepositories!;
}
