import React, { useState, useRef, useEffect } from 'react';
import { SocialEvent } from '../types';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Camera, 
  PenTool, 
  RotateCcw, 
  Check, 
  Send,
  X,
  MapPin
} from 'lucide-react';

interface VoluntarioMobilProps {
  events: SocialEvent[];
  onCompleteEvent: (eventId: string) => void;
}

export const VoluntarioMobil: React.FC<VoluntarioMobilProps> = ({
  events,
  onCompleteEvent
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const activeEvent = events.find(e => e.id === selectedEventId);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([]);

  const [offlineQueue, setOfflineQueue] = useState<Array<any>>(() => {
    const saved = localStorage.getItem('stare_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [mobileSuccess, setMobileSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (events.length > 0 && (!selectedEventId || !activeEvent)) {
      setSelectedEventId(events[0].id);
    }
  }, [events]);

  useEffect(() => {
    if (activeEvent) {
      const initialChecked: Record<string, boolean> = {};
      activeEvent.itemsBolsa.forEach(item => {
        initialChecked[item.id] = false;
      });
      setCheckedItems(initialChecked);
      setEvidencePhotos([]);
      setHasSigned(false);
      clearSignatureCanvas();
    }
  }, [selectedEventId, activeEvent]);

  useEffect(() => {
    localStorage.setItem('stare_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSigned(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignatureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const remainingSlots = 3 - evidencePhotos.length;
      const filesToProcess = files.slice(0, remainingSlots);
      
      const newPhotos = filesToProcess.map(file => URL.createObjectURL(file));
      setEvidencePhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setEvidencePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAllItems = () => {
    if (!activeEvent) return;
    const allChecked = Object.values(checkedItems).every(v => v);
    const updated: Record<string, boolean> = {};
    activeEvent.itemsBolsa.forEach(item => {
      updated[item.id] = !allChecked;
    });
    setCheckedItems(updated);
  };

  const handleFinalSubmit = () => {
    if (!activeEvent) return;

    const allVerified = Object.values(checkedItems).every(v => v);
    if (!allVerified) {
      alert('⚠️ Por favor verifique todos los insumos de la canasta física antes de confirmar la entrega.');
      return;
    }

    if (!hasSigned) {
      alert('⚠️ Se requiere la firma digital de conformidad del encargado local.');
      return;
    }

    const payload = {
      id: `dev-${Date.now()}`,
      eventId: activeEvent.id,
      eventTitle: activeEvent.title,
      timestamp: new Date().toLocaleTimeString(),
      signedBy: 'Encargado',
      itemsDelivered: activeEvent.itemsBolsa.map(i => `${i.currentQty}u de ${i.name}`),
      evidencePhotos: evidencePhotos
    };

    if (isOnline) {
      onCompleteEvent(activeEvent.id);
      setMobileSuccess(`✅ ¡Entrega sincronizada inmediatamente! El evento "${activeEvent.title}" se ha marcado como COMPLETADO.`);
    } else {
      setOfflineQueue(prev => [...prev, payload]);
      setMobileSuccess(`💾 ¡Entrega archivada localmente! Sin señal en zona rural. Se transmitirá automáticamente cuando recupere la conexión de red.`);
      // En entorno local forzamos la finalizacion también para propositos del prototipo.
      onCompleteEvent(activeEvent.id);
    }

    setEvidencePhotos([]);
    setHasSigned(false);
    clearSignatureCanvas();
    const cleanChecked: Record<string, boolean> = {};
    activeEvent.itemsBolsa.forEach(item => {
      cleanChecked[item.id] = false;
    });
    setCheckedItems(cleanChecked);

    setTimeout(() => {
      setMobileSuccess(null);
    }, 5000);
  };

  const triggerManualSync = () => {
    if (offlineQueue.length === 0) return;
    
    // Asumimos que los eventos ya fueron marcados como completos en entorno local (prototipo)
    // Pero si se enlazara con DB, aquí habría un POST bulk.

    setMobileSuccess(`🔄 Sincronización Automática Exitosa: Se han transmitido ${offlineQueue.length} actas de conformidad a la base de datos nacional.`);
    setOfflineQueue([]);

    setTimeout(() => {
      setMobileSuccess(null);
    }, 5000);
  };

  return (
    <div className="w-full space-y-6 pb-20 lg:pb-0">
      
      <div className="bg-slate-900 rounded-[28px] overflow-hidden border border-slate-800 flex flex-col min-h-[70vh] text-white shadow-xl">
        
        {/* EMERGENCY NETWORK CONTROLLER FOR EMULATOR */}
        <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Controlador de Red:
          </span>
          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              if (!isOnline) {
                setTimeout(() => {
                  triggerManualSync();
                }, 200);
              }
            }}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
              isOnline 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isOnline ? (
              <>📶 En Línea (Sincronizado)</>
            ) : (
              <>📴 Sin Señal (Offline)</>
            )}
          </button>
        </div>

        {mobileSuccess && (
          <div className="m-4 p-4 bg-indigo-600 text-white rounded-2xl text-sm leading-snug shadow-xl border border-indigo-400 font-sans animate-in fade-in slide-in-from-top-4">
            {mobileSuccess}
          </div>
        )}

        {/* LIVE SCREEN ROUTING LIST (SELECT ACTIVE TRIP EVENT) */}
        <div className="p-4 space-y-5 flex-1 font-sans">
          
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
              Ruta de Entrega Actual (En Curso):
            </label>
            {events.length === 0 ? (
              <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl text-sm text-slate-400 text-center">
                No hay eventos en curso asignados para usted.
              </div>
            ) : (
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full text-sm font-black bg-slate-800 text-amber-300 border border-slate-700 rounded-xl px-3 py-3 focus:border-amber-450 outline-none"
              >
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    🚚 {evt.district} - {evt.title.substring(0, 40)}{evt.title.length > 40 ? '...' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeEvent && (
            <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-amber-300 text-lg">{activeEvent.title}</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-slate-400 font-mono space-y-1 sm:space-y-0">
                <span>📍 Distrito: {activeEvent.district}</span>
                <span>🗓️ {activeEvent.date}</span>
              </div>
              <div className="pt-2 text-sm text-slate-300 border-t border-slate-700/50 mt-2">
                <strong>Encargo:</strong> {activeEvent.targetAudience}
              </div>
            </div>
          )}

          {/* Checklist */}
          {activeEvent && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 uppercase tracking-wider">Canasta Física:</span>
                <button
                  type="button"
                  onClick={toggleAllItems}
                  className="text-amber-400 hover:underline cursor-pointer font-bold"
                >
                  [Verificar todo]
                </button>
              </div>

              <div className="space-y-2">
                {activeEvent.itemsBolsa.length === 0 ? (
                  <p className="text-sm text-slate-450 text-center py-4 bg-slate-800/30 rounded-xl">Vacío sin ítems.</p>
                ) : (
                  activeEvent.itemsBolsa.map(item => {
                    const isChecked = !!checkedItems[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCheckedItems(prev => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }));
                        }}
                        className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-slate-800/80 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                            : 'bg-slate-850 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                        style={{ minHeight: '64px' }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                            isChecked ? 'bg-emerald-500 border-emerald-400 shadow-sm' : 'border-slate-600 bg-slate-900'
                          }`}>
                            {isChecked && <Check className="w-5 h-5 text-slate-950 stroke-[3]" />}
                          </div>
                          <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                        <span className="font-mono text-xs font-bold bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-700 text-slate-200">
                          {item.currentQty} {item.unit}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* MÓDULO DE FOTO DE EVIDENCIA */}
          {activeEvent && (
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <span className="text-xs font-mono uppercase text-slate-400 block tracking-wider">Evidencias Fotográficas (Max 3):</span>
              
              {evidencePhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {evidencePhotos.map((photo, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square group">
                      <img src={photo} alt="Evidencia" className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                      <button
                        type="button"
                        onClick={() => removePhoto(idx)}
                        className="absolute right-2 top-2 bg-slate-950/80 p-1.5 rounded-full text-rose-400 hover:text-rose-300 hover:bg-slate-900 shadow-sm transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {evidencePhotos.length < 3 && (
                <label className="w-full py-6 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handlePhotoUpload} 
                  />
                  <Camera className="w-8 h-8 text-indigo-400 mb-1" />
                  <span className="font-sans font-bold text-sm">Adjuntar Evidencia (Diferible)</span>
                  <span className="text-xs font-mono text-slate-500">Max 3 imágenes. Puede adjuntarse luego.</span>
                </label>
              )}
            </div>
          )}

          {/* LIENZO FIRMA DIGITAL */}
          {activeEvent && (
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Firma de Conformidad <span className="text-rose-400">*</span>:
                </span>
                {hasSigned && (
                  <button
                    type="button"
                    onClick={clearSignatureCanvas}
                    className="text-slate-400 hover:text-rose-400 text-xs font-mono flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Limpiar
                  </button>
                )}
              </div>
              
              <div className="bg-slate-50 border-2 border-slate-300 rounded-2xl overflow-hidden relative touch-none shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={160}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-40 cursor-crosshair block"
                  style={{ touchAction: 'none' }}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 p-4 text-center">
                    <PenTool className="w-6 h-6 text-slate-400 animate-bounce mb-2" />
                    <span className="text-sm font-sans font-medium text-slate-500">Firme aquí (Requerido)</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTION FOOTER BAR */}
        {activeEvent && (
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <button
              type="button"
              onClick={handleFinalSubmit}
              className={`w-full py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wide text-slate-950 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all ${
                isOnline 
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <Send className="w-5 h-5" /> 
              {isOnline ? 'SINCRONIZAR Y FINALIZAR VIAJE' : 'GUARDAR LOCALMENTE (OFFLINE)'}
            </button>
          </div>
        )}
      </div>

      {offlineQueue.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest block mb-3">
            📂 Almacenamiento AsyncStorage Local:
          </span>
          <div className="space-y-3">
            <p className="text-xs font-bold font-sans text-rose-600 animate-pulse flex items-center gap-1.5">
              💡 {offlineQueue.length} Expedientes en cola local. ¡Active "En Línea" para sincronizar!
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {offlineQueue.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 flex justify-between items-center">
                  <div className="truncate pr-4">
                    <strong className="text-slate-900">{item.eventTitle}</strong>
                    <span className="block text-[10px] text-slate-500 mt-0.5">{item.timestamp}</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-bold shrink-0 text-[9px]">PERSISTIDO</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
