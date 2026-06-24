/**
 * @file App.tsx
 * @description Punto de entrada principal de la aplicación STARE Piura.
 *
 * ─── CHECKPOINT FASE 3 ───
 * Integra la pantalla de Login y la inicialización de autenticación real
 * con Supabase Auth o simulación Mock.
 */

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from '@/components/ui';
import { AppRouter } from '@/app/router/AppRouter';
import { Login } from '@/pages/Login';
import { useAuthStore } from '@/stores/auth';

export default function App() {
  const { user, initialized, initializeAuth } = useAuthStore();

  // Inicializar sesión de autenticación al arrancar la app
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Pantalla de carga mientras se recupera la sesión (Supabase / LocalStorage)
  if (!initialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white font-sans">
        <Loader2 className="w-10 h-10 animate-spin text-teal-400 mb-4" />
        <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
          Inicializando STARE...
        </p>
      </div>
    );
  }

  // Si no hay sesión activa, redirigir a la pantalla de Login
  if (!user) {
    return <Login />;
  }

  // Si está autenticado, cargar el enrutador de la aplicación
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  );
}
