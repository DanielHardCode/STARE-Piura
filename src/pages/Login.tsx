import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, ShieldCheck, HeartHandshake, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui';

interface LoginProps {
  onBack?: () => void;
}

export function Login({ onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  
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

  const handleFillCredentials = (role: 'admin' | 'coordinador' | 'voluntario') => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@starepiura.org');
      setPassword('admin123');
    } else if (role === 'coordinador') {
      setEmail('coordinador@starepiura.org');
      setPassword('coordinador123');
    } else {
      setEmail('voluntario@starepiura.org');
      setPassword('voluntario123');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#121a26] relative overflow-hidden px-4 py-8 sm:px-6 transition-colors duration-300">
      
      {/* Container - Máx 700px como en la recomendación */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        className="w-full max-w-3xl relative z-10"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="absolute -top-12 left-0 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-mono tracking-wider uppercase cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>
        )}

        <div className="bg-white dark:bg-[#1e2a3a] rounded-[28px] p-8 sm:p-12 shadow-[0_25px_50px_-12px_rgba(0,20,30,0.25)] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-300 relative border border-slate-200/50 dark:border-transparent">
          
          {/* Logo / Branding */}
          <div className="flex flex-col items-center text-center mb-10 select-none">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-5">
              <HeartHandshake className="w-9 h-9 text-white stroke-[1.8]" />
            </div>
            <h1 className="text-[2.2rem] font-bold text-slate-900 dark:text-[#d0e0f0] tracking-wide mb-1 font-sans">
              STARE <span className="text-teal-600 dark:text-[#3a9a9a]">PIURA</span>
            </h1>
            <p className="text-[0.95rem] text-slate-500 dark:text-[#8a9aa8] font-normal max-w-md mt-1 leading-relaxed">
              Portal de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 dark:bg-[#1c0505] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm font-sans mb-6 text-center leading-relaxed"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-8">
            <div className="relative">
              <label className="block text-[0.85rem] font-semibold text-slate-800 dark:text-[#c0d0e0] mb-1.5 tracking-wide">
                DIRECCIÓN DE CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-[#7a8a9a] transition-colors" />
                <input
                  type="email"
                  placeholder="nombre@starepiura.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3.5 px-4 pl-11 rounded-2xl border-[1.5px] border-slate-300 dark:border-[#2a3a4a] bg-slate-50 dark:bg-[#25303e] text-slate-800 dark:text-[#c0d0e0] placeholder:text-slate-400 dark:placeholder:text-[#7a8a9a] focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10 dark:focus:ring-teal-500/10 focus:bg-white dark:focus:bg-[#1e2a3a] outline-none transition-all"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-[0.85rem] font-semibold text-slate-800 dark:text-[#c0d0e0] mb-1.5 tracking-wide">
                CONTRASEÑA
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 dark:text-[#7a8a9a] transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3.5 px-4 pl-11 rounded-2xl border-[1.5px] border-slate-300 dark:border-[#2a3a4a] bg-slate-50 dark:bg-[#25303e] text-slate-800 dark:text-[#c0d0e0] placeholder:text-slate-400 dark:placeholder:text-[#7a8a9a] focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10 dark:focus:ring-teal-500/10 focus:bg-white dark:focus:bg-[#1e2a3a] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-4 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-2xl font-semibold text-lg tracking-wide shadow-[0_4px_12px_rgba(10,42,68,0.2)] dark:shadow-[0_4px_12px_rgba(26,122,122,0.3)] transition-all flex items-center justify-center gap-2 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(10,42,68,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'INGRESAR A LA PLATAFORMA'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8 text-[0.8rem] text-slate-400 dark:text-[#7a8a9a] uppercase tracking-wider before:content-[''] before:flex-1 before:h-[1.5px] before:bg-slate-200 dark:before:bg-[#2a3a4a] after:content-[''] after:flex-1 after:h-[1.5px] after:bg-slate-200 dark:after:bg-[#2a3a4a]">
            Acceso rápido para demos
          </div>

          {/* Quick Access List */}
          <div className="bg-slate-50 dark:bg-[#182230] rounded-[18px] p-5 sm:p-6 transition-colors">
            <h3 className="text-[0.9rem] font-semibold text-slate-800 dark:text-[#c0d0e0] flex items-center gap-2 mb-4 tracking-wide">
              <Zap className="w-4 h-4 text-teal-600 dark:text-teal-500" />
              DEMOS · selecciona un perfil
            </h3>
            
            <div className="flex flex-col gap-2.5">
              {[
                { role: 'admin', label: 'Administrador', email: 'admin@starepiura.org' },
                { role: 'voluntario', label: 'Voluntario', email: 'voluntario@starepiura.org' },
                { role: 'coordinador', label: 'Coordinador', email: 'coordinador@starepiura.org' },
              ].map((item) => {
                const isSelected = selectedRole === item.role;
                return (
                  <div
                    key={item.role}
                    onClick={() => handleFillCredentials(item.role as any)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-3 sm:pl-4 rounded-xl border-2 transition-all cursor-pointer select-none
                      ${isSelected 
                        ? 'border-teal-600 bg-teal-50 dark:border-teal-500 dark:bg-[#1a3a3a] shadow-[0_0_0_3px_rgba(26,122,122,0.15)] dark:shadow-[0_0_0_3px_rgba(26,122,122,0.3)]' 
                        : 'border-slate-200 dark:border-[#2a3a4a] bg-white dark:bg-[#1e2a3a] hover:border-teal-600 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-[#25303e] hover:-translate-y-px hover:shadow-sm'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 flex-1">
                      <span className="font-semibold text-slate-900 dark:text-[#d0e0f0] text-[0.9rem] min-w-[110px]">
                        {item.label}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-[#7a8a9a] text-[0.9rem] tracking-wide">
                        {item.email}
                      </span>
                    </div>
                    
                    {/* Check icon with opacity transition */}
                    <CheckCircle2 
                      className={`w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-2 sm:mt-0 self-end sm:self-auto transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`} 
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-[0.85rem] text-slate-500 dark:text-[#7a8a9a]">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">¿Olvidaste tu contraseña?</a>
              <a href="#" className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Registrar nueva cuenta</a>
              <a href="#" className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Ayuda</a>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
