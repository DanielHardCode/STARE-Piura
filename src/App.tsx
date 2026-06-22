/**
 * @file App.tsx
 * @description Punto de entrada principal de la aplicación STARE Piura.
 *
 * Este archivo únicamente monta el AppRouter, que es quien gestiona la
 * navegación, el estado global y la composición de features.
 *
 * Arquitectura: Feature-Folder / Module-Based
 * Ver: docs/ARCHITECTURE.md
 */
import { AppRouter } from './app/router/AppRouter';

export default function App() {
  return <AppRouter />;
}
