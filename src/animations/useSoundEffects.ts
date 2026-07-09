import { useEffect, useState } from 'react';

// State management for mute status
let isMutedGlobal = false;
try {
  const stored = localStorage.getItem('stare_sound_muted');
  if (stored !== null) {
    isMutedGlobal = stored === 'true';
  }
} catch (e) {
  // Silent fallback
}

// AudioContext lazily initialized on first user interaction
let audioCtx: AudioContext | null = null;
const listeners = new Set<(muted: boolean) => void>();

function initAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const soundEffects = {
  isMuted: () => isMutedGlobal,
  
  toggleMute: () => {
    isMutedGlobal = !isMutedGlobal;
    try {
      localStorage.setItem('stare_sound_muted', String(isMutedGlobal));
    } catch (e) {
      // ignore
    }
    listeners.forEach((cb) => cb(isMutedGlobal));
    return isMutedGlobal;
  },

  subscribe: (cb: (muted: boolean) => void) => {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },

  playHover: () => {
    if (isMutedGlobal) return;
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      // Soft high pitch tick
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.03);
      
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      // AudioContext blocked or unsupported
    }
  },

  playClick: () => {
    if (isMutedGlobal) return;
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      // ignore
    }
  },

  playSuccess: () => {
    if (isMutedGlobal) return;
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      
      // Arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + index * 0.07;
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        
        gain.gain.setValueAtTime(0.06, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(noteTime);
        osc.stop(noteTime + 0.25);
      });
    } catch (e) {
      // ignore
    }
  },

  playError: () => {
    if (isMutedGlobal) return;
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      
      // Two quick buzzes
      [0, 0.12].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + delay;
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130, noteTime);
        
        gain.gain.setValueAtTime(0.05, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(noteTime);
        osc.stop(noteTime + 0.08);
      });
    } catch (e) {
      // ignore
    }
  },

  playTransition: () => {
    if (isMutedGlobal) return;
    try {
      const ctx = initAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);
      
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      // ignore
    }
  }
};

// React hook for syncing state with AudioToggle
export function useSoundState() {
  const [muted, setMuted] = useState(soundEffects.isMuted());

  useEffect(() => {
    const unsub = soundEffects.subscribe((newMuted) => {
      setMuted(newMuted);
    });
    return unsub;
  }, []);

  const toggle = () => {
    soundEffects.toggleMute();
  };

  return { muted, toggle, playHover: soundEffects.playHover, playClick: soundEffects.playClick };
}
