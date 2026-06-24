import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ShieldCheck, HeartHandshake, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { Button, Input, Card } from '@/components/ui';

interface LoginProps {
  onBack?: () => void;
}

export function Login({ onBack }: LoginProps) {
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
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-teal-500/10 blur-[110px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[110px] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="w-full max-w-lg relative z-10"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-mono tracking-wider uppercase cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>
        )}

        <Card variant="glass" className="p-10 backdrop-blur-2xl bg-slate-900/50 border-slate-800/80 shadow-2xl relative overflow-hidden rounded-[var(--radius-2xl)]">
          {/* Logo / Branding */}
          <div className="flex flex-col items-center text-center mb-8 select-none">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/10 mb-4">
              <HeartHandshake className="w-10 h-10 text-slate-950 stroke-[1.8]" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase font-mono">
              STARE Piura
            </h1>
            <p className="text-xs text-slate-450 text-slate-400 font-medium max-w-sm mt-2 leading-relaxed">
              Portal de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl text-xs font-sans mb-6 text-center leading-relaxed"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-slate-200">
              <label className="block text-xs font-sans font-bold text-slate-350 uppercase tracking-wider">
                Dirección de Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="nombre@starepiura.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3 px-4 pl-11 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2 text-slate-200">
              <label className="block text-xs font-sans font-bold text-slate-350 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3 px-4 pl-11 rounded-xl border border-slate-800 bg-slate-950/40 text-white focus:border-teal-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
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
                className="py-2.5 px-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 rounded-xl text-left transition-all cursor-pointer"
                disabled={loading}
              >
                <span className="text-[9px] font-bold text-teal-400 block font-mono">ADMINISTRADOR</span>
                <span className="text-[10px] text-slate-450 block truncate mt-0.5">admin@starepiura.org</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillCredentials('coordinador')}
                className="py-2.5 px-3 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/60 rounded-xl text-left transition-all cursor-pointer"
                disabled={loading}
              >
                <span className="text-[9px] font-bold text-amber-400 block font-mono">COORDINADOR</span>
                <span className="text-[10px] text-slate-450 block truncate mt-0.5">coordinador@starepiura.org</span>
              </button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
