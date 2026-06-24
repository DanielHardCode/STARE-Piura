/**
 * @file App.tsx
 * @description Punto de entrada principal de la aplicación STARE Piura.
 *
 * ─── CHECKPOINT FASE 1 ───
 * Monta el AppRouter completo para consumir las capas de datos mockificadas.
 */

import { ToastProvider } from '@/components/ui';
import { AppRouter } from '@/app/router/AppRouter';

export default function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}
