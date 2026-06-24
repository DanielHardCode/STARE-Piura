/**
 * @file src/repositories/mock/utils.ts
 * @description Utilidades para repositorios mock, incluyendo simulación de latencia de red.
 */

export const delay = (ms?: number): Promise<void> => {
  const min = 150;
  const max = 450;
  const time = ms ?? Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise((resolve) => setTimeout(resolve, time));
};
