import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SocialEvent, EvidenceTipo } from '@/types';
import { apiFetch } from '@/lib/api-client';
import { isMockMode, config } from '@/lib/config';
import { requireSupabase } from '@/lib/supabase/client';
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
  MapPin,
  Image,
  Upload,
  Loader2,
  AlertTriangle,
  Trash2,
  Save,
  FileImage,
  Signature,
} from 'lucide-react';

interface PendingEvidence {
  id: string;
  file: File;
  tipo: EvidenceTipo;
  preview: string;
  descripcion?: string;
  uploadedUrl?: string;
}

interface EvidenceRecord {
  tipo: EvidenceTipo;
  url: string;
  descripcion?: string;
}

interface OfflineQueueItem {
  id: string;
  eventId: string;
  eventTitle: string;
  timestamp: string;
  evidences: Array<{
    tipo: EvidenceTipo;
    dataUrl: string;
    descripcion?: string;
  }>;
}

interface VoluntarioMobilProps {
  events: SocialEvent[];
  onCompleteEvent: (eventId: string) => void;
}

function generateId(): string {
  return `ev-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bytes = atob(parts[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mime });
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
  const [savedSignatureFile, setSavedSignatureFile] = useState<File | null>(null);

  const [pendingEvidences, setPendingEvidences] = useState<PendingEvidence[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<string | null>(null);

  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('stare_offline_evidences');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [captureMode, setCaptureMode] = useState<'none' | 'foto_canasta' | 'foto_evidencia'>('none');

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
      setPendingEvidences([]);
      setHasSigned(false);
      setSavedSignatureFile(null);
      clearSignatureCanvas();
      setSyncError(null);
      setSyncSuccess(null);
    }
  }, [selectedEventId, activeEvent]);

  useEffect(() => {
    try {
      localStorage.setItem('stare_offline_evidences', JSON.stringify(offlineQueue));
    } catch {
      // localStorage might be full
    }
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
    setSavedSignatureFile(null);
  };

  const saveSignature = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSigned) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], `firma-${Date.now()}.png`, { type: 'image/png' });
      setSavedSignatureFile(file);

      const preview = URL.createObjectURL(file);
      const evId = generateId();
      setPendingEvidences(prev => [
        ...prev.filter(e => e.tipo !== 'firma'),
        { id: evId, file, tipo: 'firma', preview, descripcion: 'Firma de conformidad del encargado local' },
      ]);
    }, 'image/png');
  }, [hasSigned]);

  const handleFileCapture = useCallback((tipo: 'foto_canasta' | 'foto_evidencia') => {
    setCaptureMode(tipo);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  }, []);

  const handleFilesSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || captureMode === 'none') return;

    const tipo = captureMode;
    setCaptureMode('none');

    const remainingSlots = 5 - pendingEvidences.filter(pe => pe.tipo !== 'firma').length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToProcess) {
      const preview = URL.createObjectURL(file);
      const evId = generateId();
      const descripcion = tipo === 'foto_canasta'
        ? 'Foto de la canasta física de suministros'
        : 'Foto del lugar de entrega y evidencia';

      setPendingEvidences(prev => [...prev, { id: evId, file, tipo, preview, descripcion }]);
    }

    if (e.target) {
      e.target.value = '';
    }
  }, [captureMode, pendingEvidences]);

  const removeEvidence = useCallback((id: string) => {
    setPendingEvidences(prev => {
      const item = prev.find(e => e.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter(e => e.id !== id);
    });
  }, []);

  const uploadToSupabaseStorage = async (file: File, path: string): Promise<string> => {
    const supabase = requireSupabase();
    const { error } = await supabase.storage.from('visitas').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });
    if (error) throw new Error(`Error al subir archivo: ${error.message}`);

    const { data: publicUrlData } = supabase.storage.from('visitas').getPublicUrl(path);
    return publicUrlData?.publicUrl || `${config.supabase.url}/storage/v1/object/public/visitas/${path}`;
  };

  const syncAndComplete = useCallback(async () => {
    if (!activeEvent) return;
    const eventId = activeEvent.id;

    const allVerified = Object.values(checkedItems).every(v => v);
    if (!allVerified) {
      alert('Por favor verifique todos los insumos de la canasta física antes de confirmar la entrega.');
      return;
    }

    if (pendingEvidences.length === 0 && !hasSigned) {
      alert('Debe adjuntar al menos una foto de evidencia y la firma de conformidad.');
      return;
    }

    if (hasSigned && !savedSignatureFile) {
      alert('La firma está dibujada pero no guardada. Presione "Guardar Firma" antes de sincronizar.');
      return;
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1200));
        onCompleteEvent(eventId);
        setSyncSuccess('Entrega registrada exitosamente (modo demostrativo).');
        resetForm();
        return;
      }

      const evidenceRecords: EvidenceRecord[] = [];

      for (const pe of pendingEvidences) {
        const storagePath = `visitas/${eventId}/${pe.tipo}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
        let publicUrl: string;

        try {
          publicUrl = await uploadToSupabaseStorage(pe.file, storagePath);
        } catch (uploadErr: any) {
          if (uploadErr.message?.includes('duplicate')) {
            const retryPath = `visitas/${eventId}/${pe.tipo}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
            publicUrl = await uploadToSupabaseStorage(pe.file, retryPath);
          } else {
            throw uploadErr;
          }
        }

        evidenceRecords.push({ tipo: pe.tipo, url: publicUrl, descripcion: pe.descripcion });
      }

      if (config.dataProvider === 'supabase_laravel') {
        await apiFetch(`/events/${eventId}/complete`, {
          method: 'PUT',
          body: JSON.stringify({ evidences: evidenceRecords }),
        });
        setSyncSuccess('Evidencias guardadas y evento marcado como completado.');
      } else {
        const supabase = requireSupabase();
        const { error: insertErr } = await supabase
          .from('visit_evidences')
          .insert(evidenceRecords.map(r => ({ ...r, event_id: eventId })));

        if (insertErr) throw new Error(`Error al guardar evidencias: ${insertErr.message}`);

        onCompleteEvent(eventId);
        setSyncSuccess('Evidencias guardadas y evento completado.');
      }

      if (config.dataProvider === 'supabase_laravel') {
        onCompleteEvent(eventId);
      }

      resetForm();
    } catch (err: any) {
      console.error('Sync error:', err);

      if (!navigator.onLine) {
        const offlineItem: OfflineQueueItem = {
          id: `off-${Date.now()}`,
          eventId,
          eventTitle: activeEvent.title,
          timestamp: new Date().toLocaleTimeString(),
          evidences: await Promise.all(
            pendingEvidences.map(async (pe) => ({
              tipo: pe.tipo,
              dataUrl: await fileToDataUrl(pe.file),
              descripcion: pe.descripcion,
            }))
          ),
        };
        setOfflineQueue(prev => [...prev, offlineItem]);
        setSyncSuccess('Sin conexión. Datos guardados localmente. Se sincronizarán automáticamente cuando recupere la red.');
        resetForm();
      } else {
        setSyncError(err.message || 'Error al sincronizar evidencias.');
      }
    } finally {
      setIsSyncing(false);
    }
  }, [activeEvent, checkedItems, pendingEvidences, hasSigned, savedSignatureFile, onCompleteEvent]);

  const resetForm = useCallback(() => {
    setPendingEvidences([]);
    setHasSigned(false);
    setSavedSignatureFile(null);
    clearSignatureCanvas();
    if (activeEvent) {
      const cleanChecked: Record<string, boolean> = {};
      activeEvent.itemsBolsa.forEach(item => { cleanChecked[item.id] = false; });
      setCheckedItems(cleanChecked);
    }
    setTimeout(() => setSyncSuccess(null), 5000);
  }, [activeEvent]);

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;

    const remaining: OfflineQueueItem[] = [];

    for (const item of offlineQueue) {
      try {
        const evidenceRecords: EvidenceRecord[] = [];

        for (const ev of item.evidences) {
          const blob = dataUrlToBlob(ev.dataUrl);
          const ext = ev.tipo === 'firma' ? 'png' : 'jpg';
          const mime = ev.tipo === 'firma' ? 'image/png' : 'image/jpeg';
          const file = new File([blob], `${ev.tipo}-${Date.now()}.${ext}`, { type: mime });

          const storagePath = `visitas/${item.eventId}/${ev.tipo}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.png`;
          let publicUrl: string;

          if (isMockMode) {
            publicUrl = URL.createObjectURL(blob);
          } else {
            const supabase = requireSupabase();
            const { error: uploadErr } = await supabase.storage.from('visitas').upload(storagePath, file, {
              cacheControl: '3600',
              upsert: false,
            });
            if (uploadErr) throw uploadErr;
            const { data: urlData } = supabase.storage.from('visitas').getPublicUrl(storagePath);
            publicUrl = urlData?.publicUrl || '';
          }

          evidenceRecords.push({ tipo: ev.tipo, url: publicUrl, descripcion: ev.descripcion });
        }

        if (config.dataProvider === 'supabase_laravel') {
          await apiFetch(`/events/${item.eventId}/complete`, {
            method: 'PUT',
            body: JSON.stringify({ evidences: evidenceRecords }),
          });
        } else if (!isMockMode) {
          const supabase = requireSupabase();
          await supabase.from('visit_evidences').insert(
            evidenceRecords.map(r => ({ ...r, event_id: item.eventId }))
          );
        }

        onCompleteEvent(item.eventId);
      } catch (err) {
        remaining.push(item);
      }
    }

    setOfflineQueue(remaining);
    if (remaining.length === 0) {
      setSyncSuccess('Cola offline sincronizada exitosamente.');
      setTimeout(() => setSyncSuccess(null), 4000);
    }
  }, [offlineQueue, onCompleteEvent]);

  const toggleAllItems = () => {
    if (!activeEvent) return;
    const allChecked = Object.values(checkedItems).every(v => v);
    const updated: Record<string, boolean> = {};
    activeEvent.itemsBolsa.forEach(item => { updated[item.id] = !allChecked; });
    setCheckedItems(updated);
  };

  const triggerManualSync = () => {
    if (isOnline && offlineQueue.length > 0) {
      processOfflineQueue();
    } else if (offlineQueue.length > 0) {
      setSyncSuccess('Active "En Línea" para sincronizar los datos pendientes.');
      setTimeout(() => setSyncSuccess(null), 3000);
    }
  };

  const photoEvidenceCount = pendingEvidences.filter(e => e.tipo !== 'firma').length;
  const hasSignatureEvidence = pendingEvidences.some(e => e.tipo === 'firma');
  const canSync = activeEvent &&
    Object.values(checkedItems).every(v => v) &&
    (photoEvidenceCount > 0 || hasSignatureEvidence) &&
    (!hasSigned || (hasSigned && savedSignatureFile));

  return (
    <div className="w-full space-y-6 pb-20 lg:pb-0">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={handleFilesSelected}
      />

      <div className="bg-slate-900 rounded-[28px] overflow-hidden border border-slate-800 flex flex-col min-h-[70vh] text-white shadow-xl">

        <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
            Controlador de Red:
          </span>
          <button
            type="button"
            onClick={() => {
              setIsOnline(!isOnline);
              if (isOnline && offlineQueue.length > 0) {
                setTimeout(() => processOfflineQueue(), 200);
              }
            }}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}
          >
            {isOnline ? (
              <><Wifi className="w-3.5 h-3.5" /> En Línea</>
            ) : (
              <><WifiOff className="w-3.5 h-3.5" /> Sin Señal</>
            )}
          </button>
        </div>

        {syncSuccess && (
          <div className="m-4 p-4 bg-emerald-600 text-white rounded-2xl text-sm leading-snug shadow-xl border border-emerald-400 font-sans animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 inline mr-2" />
            {syncSuccess}
          </div>
        )}

        {syncError && (
          <div className="m-4 p-4 bg-rose-600 text-white rounded-2xl text-sm leading-snug shadow-xl border border-rose-400 font-sans animate-in fade-in slide-in-from-top-4 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
            <span>{syncError}</span>
          </div>
        )}

        <div className="p-4 space-y-5 flex-1 font-sans">

          {/* Selector de Ruta */}
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
                    {evt.district} - {evt.title.substring(0, 40)}{evt.title.length > 40 ? '...' : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activeEvent && (
            <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="font-bold text-amber-300 text-lg">{activeEvent.title}</p>
              <div className="flex flex-col sm:flex-row sm:gap-4 text-xs text-slate-400 font-mono space-y-1 sm:space-y-0">
                <span><MapPin className="w-3 h-3 inline mr-1" />{activeEvent.district}</span>
                <span>{activeEvent.date}</span>
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
                          setCheckedItems(prev => ({ ...prev, [item.id]: !prev[item.id] }));
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

          {/* Evidencias Fotográficas */}
          {activeEvent && (
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Evidencias Fotográficas ({photoEvidenceCount}/5):
                </span>
              </div>

              {pendingEvidences.filter(e => e.tipo !== 'firma').length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {pendingEvidences.filter(e => e.tipo !== 'firma').map((pe) => (
                    <div key={pe.id} className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-square group">
                      <img src={pe.preview} alt={pe.tipo === 'foto_canasta' ? 'Canasta' : 'Evidencia'} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                      <span className={`absolute left-1 top-1 text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        pe.tipo === 'foto_canasta' ? 'bg-indigo-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {pe.tipo === 'foto_canasta' ? 'CANASTA' : 'LUGAR'}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeEvidence(pe.id)}
                        className="absolute right-1 top-1 bg-slate-950/80 p-1 rounded-full text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photoEvidenceCount < 5 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFileCapture('foto_canasta')}
                    className="flex-1 py-3 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-indigo-400" />
                    <span className="text-[10px] font-bold">Foto Canasta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFileCapture('foto_evidencia')}
                    className="flex-1 py-3 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white hover:border-amber-500 hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <Image className="w-6 h-6 text-amber-400" />
                    <span className="text-[10px] font-bold">Foto Lugar</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Firma Digital */}
          {activeEvent && (
            <div className="space-y-3 border-t border-slate-800 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Firma de Conformidad <span className="text-rose-400">*</span>:
                </span>
                <div className="flex gap-1">
                  {hasSigned && !savedSignatureFile && (
                    <button
                      type="button"
                      onClick={saveSignature}
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer bg-emerald-500/10 px-2.5 py-1 rounded-md transition-colors border border-emerald-500/30"
                    >
                      <Check className="w-3 h-3" /> Guardar
                    </button>
                  )}
                  {hasSigned && (
                    <button
                      type="button"
                      onClick={clearSignatureCanvas}
                      className="text-slate-400 hover:text-rose-400 text-[10px] font-mono flex items-center gap-1 cursor-pointer bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" /> Limpiar
                    </button>
                  )}
                </div>
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

              {savedSignatureFile && (
                <div className="flex items-center gap-2 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  Firma guardada correctamente
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        {activeEvent && (
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <button
              type="button"
              onClick={syncAndComplete}
              disabled={isSyncing || !canSync}
              className={`w-full py-4 rounded-2xl font-sans font-black text-sm uppercase tracking-wide text-slate-950 cursor-pointer flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isOnline
                  ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20 hover:-translate-y-0.5 active:translate-y-0'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              {isSyncing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> SINCRONIZANDO...</>
              ) : isOnline ? (
                <><Upload className="w-5 h-5" /> SINCRONIZAR Y FINALIZAR VIAJE</>
              ) : (
                <><Save className="w-5 h-5" /> GUARDAR LOCALMENTE (OFFLINE)</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Offline Queue */}
      {offlineQueue.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              Cola Offline ({offlineQueue.length} pendientes):
            </span>
            {isOnline && (
              <button
                type="button"
                onClick={processOfflineQueue}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sincronizar ahora
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {offlineQueue.map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 flex justify-between items-center">
                <div className="truncate pr-4">
                  <strong className="text-slate-900">{item.eventTitle}</strong>
                  <span className="block text-[10px] text-slate-500 mt-0.5">{item.timestamp} — {item.evidences.length} evidencia(s)</span>
                </div>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded uppercase font-bold shrink-0 text-[9px]">OFFLINE</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

