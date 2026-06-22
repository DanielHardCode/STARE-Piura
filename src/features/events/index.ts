/**
 * @file index.ts — Feature: events
 * @description Barrel de re-exportación pública de la feature de Eventos Sociales.
 * Solo exporta lo que otras features o la app necesitan consumir.
 */
export * from './types/event.types';
export * from './hooks/useEvents';
export * from './data/events.seed';
