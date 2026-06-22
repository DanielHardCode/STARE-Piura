/**
 * @file useLocalStorage.ts
 * @description Hook genérico para sincronizar estado de React con localStorage.
 * Usa storageService como capa de abstracción.
 */
import { useState, useEffect } from 'react';
import { storageService } from '../services/storage.service';

/**
 * Hook que sincroniza automáticamente un valor de estado con localStorage.
 *
 * @param key - Clave de localStorage (ej: 'stare_events')
 * @param initialValue - Valor por defecto si no existe en localStorage
 * @returns [value, setValue] igual que useState
 *
 * @example
 * const [events, setEvents] = useLocalStorage<SocialEvent[]>('stare_events', INITIAL_EVENTS);
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    const saved = storageService.get<T>(key);
    return saved !== null ? saved : initialValue;
  });

  useEffect(() => {
    storageService.set(key, state);
  }, [key, state]);

  return [state, setState];
}
