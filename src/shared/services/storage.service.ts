/**
 * @file storage.service.ts
 * @description Capa de abstracción sobre localStorage para toda la aplicación STARE Piura.
 * Centraliza el acceso a persistencia local, facilita testing y evita duplicación.
 */

export const storageService = {
  /**
   * Lee y parsea un ítem del localStorage.
   * Retorna null si no existe o si falla el parse.
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      console.warn(`[StorageService] Error al leer clave "${key}"`, );
      return null;
    }
  },

  /**
   * Serializa y guarda un ítem en localStorage.
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`[StorageService] Error al escribir clave "${key}"`);
    }
  },

  /**
   * Elimina un ítem del localStorage.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  },

  /**
   * Limpia TODOS los ítems de STARE del localStorage.
   */
  clearAll(prefix = 'stare_'): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(prefix))
      .forEach(k => localStorage.removeItem(k));
  },
};
