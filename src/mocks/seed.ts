/**
 * @file src/mocks/seed.ts
 * @description Configuración del seed fijo de Faker para STARE Piura.
 * El seed garantiza que los datos generados sean IDÉNTICOS entre recargas,
 * haciendo las demos y pruebas reproducibles.
 */

import { faker } from '@faker-js/faker/locale/es';

/** Semilla fija. Cambiar este valor regenera todos los datos. */
export const FAKER_SEED = 42_195;

/** Faker pre-configurado con locale es (español) y seed fijo. */
export function createSeededFaker() {
  faker.seed(FAKER_SEED);
  return faker;
}

/** Instancia global pre-seeded para usar en todos los generadores. */
export const f = createSeededFaker();
