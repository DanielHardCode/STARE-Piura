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

import {
  SupabaseLaravelOrganizationRepository,
  SupabaseLaravelMypeRepository,
  SupabaseLaravelDonorRepository,
  SupabaseLaravelDonationRepository,
  SupabaseLaravelEventRepository,
  SupabaseLaravelTransactionRepository,
  SupabaseLaravelNotificationRepository
} from './supabase_laravel';

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
    cachedRepositories = {
      organizations: new SupabaseLaravelOrganizationRepository(),
      mypes: new SupabaseLaravelMypeRepository(),
      donors: new SupabaseLaravelDonorRepository(),
      donations: new SupabaseLaravelDonationRepository(),
      events: new SupabaseLaravelEventRepository(),
      transactions: new SupabaseLaravelTransactionRepository(),
      notifications: new SupabaseLaravelNotificationRepository(),
    };
  }

  return cachedRepositories;
}
