import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { Button, Input, Card } from '@/components/ui';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    try {
      await login(email, password);
    } catch (err) {
      console.error('Error al hacer login:', err);
    }
  };

  const handleFillCredentials = (role: 'admin' | 'coordinador') => {
    if (role === 'admin') {
      setEmail('admin@starepiura.org');
      setPassword('admin123');
    } else {
      setEmail('coordinador@starepiura.org');
      setPassword('coordinador123');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden px-4 sm:px-6">
      {/* Background Decorative Gradients (Premium Apple-style glowing blobs) */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="w-full max-w-md"
      >
        <Card variant="glass" className="p-8 backdrop-blur-xl bg-slate-900/60 border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Logo / Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-4">
              <HeartHandshake className="w-9 h-9 text-slate-950 stroke-[1.8]" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase font-mono">
              STARE Piura
            </h1>
            <p className="text-xs text-slate-400 font-medium max-w-xs mt-1">
              Plataforma de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/15 border border-red-500/20 text-red-300 p-3.5 rounded-xl text-xs font-sans mb-6 text-center leading-relaxed"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-slate-300">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="ejemplo@starepiura.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1 text-slate-300">
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-teal-500/10 transition-all flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Ingresar a la plataforma'
              )}
            </Button>
          </form>

          {/* Quick Credential Hints (For demo/testing purposes) */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <p className="text-[10px] text-center text-slate-400 font-mono tracking-wider uppercase mb-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Acceso Rápido para Demos
            </p>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleFillCredentials('admin')}
                className="py-2.5 px-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 rounded-xl text-left transition-all"
                disabled={loading}
              >
                <span className="text-[10px] font-bold text-teal-400 block font-mono">ADMINISTRADOR</span>
                <span className="text-[9px] text-slate-500 block truncate">admin@starepiura.org</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillCredentials('coordinador')}
                className="py-2.5 px-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 rounded-xl text-left transition-all"
                disabled={loading}
              >
                <span className="text-[10px] font-bold text-amber-400 block font-mono">COORDINADOR</span>
                <span className="text-[9px] text-slate-500 block truncate">coordinador@starepiura.org</span>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
