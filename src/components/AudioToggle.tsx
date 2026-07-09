import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';
import { useSoundState } from '@/animations/useSoundEffects';

export function AudioToggle() {
  const { muted, toggle, playHover, playClick } = useSoundState();

  const handleToggle = () => {
    // Play click sound using the new state after toggle (if unmuted now)
    toggle();
    // Delay slightly to play the click after audio resumes
    setTimeout(() => {
      playClick();
    }, 20);
  };

  return (
    <motion.button
      onClick={handleToggle}
      onMouseEnter={playHover}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-bg-primary)] hover:border-teal-500/30 text-[var(--color-text-secondary)] hover:text-teal-400 transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
      aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
      title={muted ? 'Activar efectos de sonido' : 'Silenciar efectos de sonido'}
    >
      {/* Sound waves icon representation */}
      <div className="flex items-center gap-0.5 h-3 w-4 justify-center">
        {muted ? (
          <VolumeX className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        ) : (
          <>
            {/* Visual soundwave bars */}
            <motion.span
              animate={{ height: ['4px', '12px', '4px'] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              className="w-[2px] bg-teal-400 rounded-full"
            />
            <motion.span
              animate={{ height: ['6px', '16px', '6px'] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.15, ease: 'easeInOut' }}
              className="w-[2px] bg-emerald-400 rounded-full"
            />
            <motion.span
              animate={{ height: ['3px', '10px', '3px'] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.3, ease: 'easeInOut' }}
              className="w-[2px] bg-teal-400 rounded-full"
            />
          </>
        )}
      </div>

      <span className="text-[10px] font-bold font-mono tracking-wider uppercase hidden sm:inline select-none">
        {muted ? 'Audio Off' : 'Audio On'}
      </span>
    </motion.button>
  );
}
