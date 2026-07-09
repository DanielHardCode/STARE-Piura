import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Loader2, HeartHandshake, ArrowLeft, CheckCircle2, Zap } from 'lucide-react';
import { useAuthStore } from '@/stores/auth';
import { useParticleCanvas } from '@/animations/useParticleCanvas';
import { useGridCanvas }     from '@/animations/useGridCanvas';
import { listItemVariants, listContainerVariants } from '@/animations/variants';
import { useSoundState, soundEffects } from '@/animations/useSoundEffects';
import loginNetwork from '@/assets/login_network.jpg';
import { useEffect } from 'react';
import { useImageCanvasOverlay } from '@/animations/useImageCanvasOverlay';

interface LoginProps {
  onBack?: () => void;
}

export function Login({ onBack }: LoginProps) {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);
  const { playHover, playClick } = useSoundState();

  const { login, loading, error, user } = useAuthStore();

  // Play sound on login success or error
  useEffect(() => {
    if (error) {
      soundEffects.playError();
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      soundEffects.playSuccess();
    }
  }, [user]);

  // ── Canvas refs ─────────────────────────────────────────────────────────────
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const gridCanvasRef     = useRef<HTMLCanvasElement>(null);
  const loginImageCanvasRef    = useRef<HTMLCanvasElement>(null);
  const loginImageContainerRef = useRef<HTMLDivElement>(null);

  // ── Canvas hooks ────────────────────────────────────────────────────────────
  useImageCanvasOverlay(loginImageCanvasRef, loginImageContainerRef);
  useParticleCanvas(particleCanvasRef, {
    count:       48,
    color:       '45,212,191',    // teal-400
    accentColor: '251,191,36',    // amber-400
    maxDist:     110,
    speed:       0.35,
    radius:      2,
    opacity:     0.5,
  });

  useGridCanvas(gridCanvasRef, {
    gap:           36,
    dotRadius:     1.2,
    color:         '45,212,191',
    opacity:       0.12,
    repelDist:     70,
    repelStrength: 14,
  });

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    playClick();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Error al hacer login:', err);
    }
  };

  const handleFillCredentials = (role: 'admin' | 'coordinador' | 'voluntario') => {
    playClick();
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
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#0b1320] relative overflow-hidden px-4 py-8 sm:px-6 transition-colors duration-300">

      {/* ── Canvas: grid de puntos (fondo más profundo) ── */}
      <canvas
        ref={gridCanvasRef}
        className="canvas-bg"
        aria-hidden="true"
      />

      {/* ── Canvas: partículas conectadas (capa media) ── */}
      <canvas
        ref={particleCanvasRef}
        className="canvas-bg"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />

      {/* ── Blobs de color de fondo ── */}
      <div className="absolute top-[-15%] left-[-8%]  w-80 h-80 rounded-full bg-teal-500/8  blur-[100px] pointer-events-none" style={{ zIndex: 1 }} />
      <div className="absolute bottom-[-10%] right-[-8%] w-72 h-72 rounded-full bg-amber-500/6 blur-[90px]  pointer-events-none" style={{ zIndex: 1 }} />

      {/* ── Contenedor principal ── */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1    }}
        transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.05 }}
        className="w-full max-w-3xl relative"
        style={{ zIndex: 2 }}
      >
        {onBack && (
          <motion.button
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ delay: 0.25 }}
            onMouseEnter={playHover}
            onClick={() => { playClick(); onBack(); }}
            className="absolute -top-12 left-0 flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-mono tracking-wider uppercase cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </motion.button>
        )}

        <div className="bg-white/90 dark:bg-[#131e2f]/95 backdrop-blur-xl rounded-[28px] shadow-[0_30px_60px_-12px_rgba(0,20,40,0.3)] dark:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.7)] transition-all duration-300 relative border border-slate-200/60 dark:border-white/5 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left panel: Image decoration */}
          <div ref={loginImageContainerRef} className="hidden md:block md:col-span-5 relative bg-slate-950">
            <img 
              src={loginNetwork} 
              alt="Network" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity hover:opacity-85 hover:mix-blend-normal transition-all duration-700 select-none pointer-events-none" 
            />
            <canvas
              ref={loginImageCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#131e2f] via-slate-900/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-left space-y-2 z-10 font-sans">
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-400 uppercase">Seguridad Zonal</span>
              <h2 className="text-xl font-black text-white leading-tight uppercase font-mono">Trazabilidad Segura</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">Acceso cifrado y autenticado bajo protocolo RBAC regional.</p>
            </div>
          </div>

          {/* Right panel: Login form */}
          <div className="col-span-1 md:col-span-7 p-8 sm:p-12">

          {/* ── Logo / Branding ── */}
          <div className="flex flex-col items-center text-center mb-10 select-none">

            {/* Logo con orbit ring y glow */}
            <div className="relative mb-5 flex items-center justify-center">
              {/* Orbit ring exterior */}
              <div
                className="orbit-ring"
                style={{ width: 88, height: 88, top: -4, left: -4 }}
                aria-hidden="true"
              />
              {/* Orbit ring interior */}
              <div
                className="orbit-ring"
                style={{
                  width: 72, height: 72, top: 4, left: 4,
                  animationDirection: 'reverse',
                  animationDuration: '8s',
                  borderStyle: 'solid',
                  borderWidth: '1px',
                  borderColor: 'rgba(251,191,36,0.15)',
                }}
                aria-hidden="true"
              />

              {/* Logo icon con glow */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0, rotate: -15 }}
                animate={{ scale: 1,   opacity: 1, rotate: 0   }}
                transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
                className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center animate-glow relative z-10"
              >
                <HeartHandshake className="w-9 h-9 text-white stroke-[1.8]" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.25 }}
              className="text-[2.2rem] font-bold text-slate-900 dark:text-[#d0e0f0] tracking-wide mb-1 font-sans"
            >
              STARE <span className="text-teal-600 dark:text-[#3a9a9a]">PIURA</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="text-[0.95rem] text-slate-500 dark:text-[#8a9aa8] font-normal max-w-md mt-1 leading-relaxed"
            >
              Portal de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
            </motion.p>
          </div>

          {/* ── Error Message ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              className="bg-red-50 dark:bg-[#1c0505] border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 p-4 rounded-xl text-sm font-sans mb-6 text-center leading-relaxed"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5 mb-8"
            variants={listContainerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Email */}
            <motion.div variants={listItemVariants} className="relative">
              <label className="block text-[0.85rem] font-semibold text-slate-800 dark:text-[#c0d0e0] mb-1.5 tracking-wide">
                DIRECCIÓN DE CORREO ELECTRÓNICO
              </label>
              <div className="relative">
                <motion.div
                  animate={focusedField === 'email' ? { scale: 1.1, color: '#0d9488' } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Mail className="w-[18px] h-[18px] text-slate-400 dark:text-[#7a8a9a]" />
                </motion.div>
                <input
                  type="email"
                  placeholder="nombre@starepiura.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => { playHover(); setFocusedField('email'); }}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3.5 px-4 pl-11 rounded-2xl border-[1.5px] border-slate-300 dark:border-[#2a3a4a] bg-slate-50 dark:bg-[#25303e] text-slate-800 dark:text-[#c0d0e0] placeholder:text-slate-400 dark:placeholder:text-[#7a8a9a] focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10 dark:focus:ring-teal-500/10 focus:bg-white dark:focus:bg-[#1e2a3a] outline-none transition-all"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={listItemVariants} className="relative">
              <label className="block text-[0.85rem] font-semibold text-slate-800 dark:text-[#c0d0e0] mb-1.5 tracking-wide">
                CONTRASEÑA
              </label>
              <div className="relative">
                <motion.div
                  animate={focusedField === 'password' ? { scale: 1.1, color: '#0d9488' } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <Lock className="w-[18px] h-[18px] text-slate-400 dark:text-[#7a8a9a]" />
                </motion.div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => { playHover(); setFocusedField('password'); }}
                  onBlur={() => setFocusedField(null)}
                  disabled={loading}
                  required
                  className="w-full text-base py-3.5 px-4 pl-11 rounded-2xl border-[1.5px] border-slate-300 dark:border-[#2a3a4a] bg-slate-50 dark:bg-[#25303e] text-slate-800 dark:text-[#c0d0e0] placeholder:text-slate-400 dark:placeholder:text-[#7a8a9a] focus:border-teal-600 dark:focus:border-teal-500 focus:ring-4 focus:ring-teal-600/10 dark:focus:ring-teal-500/10 focus:bg-white dark:focus:bg-[#1e2a3a] outline-none transition-all"
                />
              </div>
            </motion.div>

            {/* Submit button con shimmer-sweep */}
            <motion.div variants={listItemVariants}>
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={playHover}
                className="shimmer-sweep-effect w-full mt-2 py-4 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-2xl font-semibold text-lg tracking-wide shadow-[0_4px_12px_rgba(10,42,68,0.2)] dark:shadow-[0_4px_12px_rgba(26,122,122,0.3)] transition-all flex items-center justify-center gap-2 hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(10,42,68,0.25)] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:transform-none"
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
            </motion.div>
          </motion.form>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4 my-8 text-[0.8rem] text-slate-400 dark:text-[#7a8a9a] uppercase tracking-wider before:content-[''] before:flex-1 before:h-[1.5px] before:bg-slate-200 dark:before:bg-[#2a3a4a] after:content-[''] after:flex-1 after:h-[1.5px] after:bg-slate-200 dark:after:bg-[#2a3a4a]">
            Acceso rápido para demos
          </div>

          {/* ── Quick Access List ── */}
          <motion.div
            className="bg-slate-50 dark:bg-[#182230] rounded-[18px] p-5 sm:p-6 transition-colors"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <h3 className="text-[0.9rem] font-semibold text-slate-800 dark:text-[#c0d0e0] flex items-center gap-2 mb-4 tracking-wide">
              <Zap className="w-4 h-4 text-teal-600 dark:text-teal-500" />
              DEMOS · selecciona un perfil
            </h3>

            <div className="flex flex-col gap-2.5">
              {[
                { role: 'admin',       label: 'Administrador', email: 'admin@starepiura.org'       },
                { role: 'voluntario',  label: 'Voluntario',    email: 'voluntario@starepiura.org'  },
                { role: 'coordinador', label: 'Coordinador',   email: 'coordinador@starepiura.org' },
              ].map((item, idx) => {
                const isSelected = selectedRole === item.role;
                return (
                  <motion.div
                    key={item.role}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0   }}
                    transition={{ delay: 0.5 + idx * 0.07, type: 'spring', stiffness: 260, damping: 22 }}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                    onMouseEnter={playHover}
                    onClick={() => handleFillCredentials(item.role as any)}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-3 sm:pl-4 rounded-xl border-2 transition-all cursor-pointer select-none
                      ${isSelected
                        ? 'border-teal-600 bg-teal-50 dark:border-teal-500 dark:bg-[#1a3a3a] shadow-[0_0_0_3px_rgba(26,122,122,0.15)] dark:shadow-[0_0_0_3px_rgba(26,122,122,0.3)]'
                        : 'border-slate-200 dark:border-[#2a3a4a] bg-white dark:bg-[#1e2a3a] hover:border-teal-600 dark:hover:border-teal-500 hover:bg-slate-50 dark:hover:bg-[#25303e] hover:shadow-sm'
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
                    <CheckCircle2
                      className={`w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-2 sm:mt-0 self-end sm:self-auto transition-all duration-300 ${isSelected ? 'opacity-100 scale-110' : 'opacity-0 scale-75'}`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Footer Links ── */}
          <motion.div
            className="mt-8 text-center text-[0.85rem] text-slate-500 dark:text-[#7a8a9a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <a href="#" onMouseEnter={playHover} onClick={playClick} className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">¿Olvidaste tu contraseña?</a>
              <a href="#" onMouseEnter={playHover} onClick={playClick} className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Registrar nueva cuenta</a>
              <a href="#" onMouseEnter={playHover} onClick={playClick} className="font-medium text-slate-800 dark:text-[#d0e0f0] hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Ayuda</a>
            </div>
          </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
