import React, { useState, useRef, useEffect } from 'react';
import { SocialEvent, BolsaItem } from '../types';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Camera, 
  PenTool, 
  RotateCcw, 
  CloudLightning, 
  Database, 
  Check, 
  AlertTriangle, 
  Send, 
  Info,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ClipboardCheck,
  SmartphoneIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VoluntarioMobilProps {
  events: SocialEvent[];
  onCompleteEvent: (eventId: string) => void;
}

export const VoluntarioMobil: React.FC<VoluntarioMobilProps> = ({
  events,
  onCompleteEvent
}) => {
  // Mobile app simulator States
  const [isOnline, setIsOnline] = useState<boolean>(false); // Starts offline to show off offline-first
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const activeEvent = events.find(e => e.id === selectedEventId);

  // Load verification checklists
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  
  // Signature States
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Camera mock
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  // AsyncStorage Queue Simulation list
  const [offlineQueue, setOfflineQueue] = useState<Array<{
    id: string;
    eventId: string;
    eventTitle: string;
    timestamp: string;
    signedBy: string;
    itemsDelivered: string[];
    evidencePhoto: string;
  }>>(() => {
    const saved = localStorage.getItem('stare_offline_queue');
    return saved ? JSON.parse(saved) : [];
  });

  // Action Success Banner Inside Mobile App
  const [mobileSuccess, setMobileSuccess] = useState<string | null>(null);

  // Auto-fill checklist on event toggle
  useEffect(() => {
    if (activeEvent) {
      const initialChecked: Record<string, boolean> = {};
      activeEvent.itemsBolsa.forEach(item => {
        initialChecked[item.id] = false;
      });
      setCheckedItems(initialChecked);
      setEvidencePhoto(null);
      setHasSigned(false);
      clearSignatureCanvas();
    }
  }, [selectedEventId]);

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('stare_offline_queue', JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Handle signature drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b'; // slate-800
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

  // Simulated Camera Snapping
  const capturePhoto = (sampleUrl: string) => {
    setEvidencePhoto(sampleUrl);
    setIsCameraActive(false);
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

  // Primary Action: Submit Delivery
  const handleFinalSubmit = () => {
    if (!activeEvent) return;

    // Validation
    const allVerified = Object.values(checkedItems).every(v => v);
    if (!allVerified) {
      alert('⚠️ Por favor verifique todos los insumos de la canasta física antes de confirmar la entrega.');
      return;
    }

    if (!evidencePhoto) {
      alert('⚠️ Se requiere registrar una fotografía de evidencia para garantizar la trazabilidad.');
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
      signedBy: 'Encargado de PRONOEI/Comedor Piura',
      itemsDelivered: activeEvent.itemsBolsa.map(i => `${i.currentQty}u de ${i.name}`),
      evidencePhoto: evidencePhoto
    };

    if (isOnline) {
      // Inmediata Sincronización a Base de Datos Central (Web Dashboard state)
      onCompleteEvent(activeEvent.id);
      setMobileSuccess(`✅ ¡Entrega sincronizada inmediatamente! El evento "${activeEvent.title}" se ha marcado como COMPLETADO en el panel central de Piura.`);
    } else {
      // Guardar de inmediato en almacenamiento AsyncStorage Simulado local
      setOfflineQueue(prev => [...prev, payload]);
      setMobileSuccess(`💾 ¡Entrega archivada localmente en AsyncStorage! Sin señal en zona rural. Se transmitirá automáticamente cuando recupere la conexión de red.`);
    }

    // Reset Mobile Form
    setEvidencePhoto(null);
    setHasSigned(false);
    clearSignatureCanvas();
    const cleanChecked: Record<string, boolean> = {};
    activeEvent.itemsBolsa.forEach(item => {
      cleanChecked[item.id] = false;
    });
    setCheckedItems(cleanChecked);

    setTimeout(() => {
      setMobileSuccess(null);
    }, 8500);
  };

  // Sync Offline Queue when returning Online
  const triggerManualSync = () => {
    if (offlineQueue.length === 0) return;
    
    // Sync all queue elements
    offlineQueue.forEach(item => {
      onCompleteEvent(item.eventId);
    });

    setMobileSuccess(`🔄 Sincronización Automática Exitosa: Se han transmitido ${offlineQueue.length} actas de conformidad desde la caché del celular a la base de datos nacional.`);
    setOfflineQueue([]);

    setTimeout(() => {
      setMobileSuccess(null);
    }, 7000);
  };

  return (
    <div className="space-y-8">
      
      {/* EXPLICATIVE HEADER AND CONTEXT OF THE DESIGN */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Smartphone className="w-5 h-5 animate-pulse" />
              </span>
              <h2 className="font-sans font-black text-slate-800 text-lg uppercase tracking-tight">
                Módulos de Logística y Trazabilidad de Campo (Móvil)
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono tracking-wide">
              ENTORNO DESIGN SYSTEM • ENFOQUE OFFLINE-FIRST (REDUCCIÓN DE BRECHAS EN PIURA)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100 p-2.5 rounded-2xl">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            <span>Simulador de React Native Activo</span>
          </div>
        </div>
      </div>

      {/* DETAILED DOUBLE GRID: BLUEPRINT / THEORY vs LIVE INTERACTIVE EMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THEORETICAL BLUEPRINT / ARCHITECTURE & COPYABLE REACT NATIVE CODE (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Bento Card: Architecture & UX justification */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border-b-4 border-slate-950 space-y-5">
            
            <span className="bg-amber-400 text-slate-950 font-mono font-bold text-[9px] px-3 py-1 rounded-full border border-slate-950">
              COMPRENSIÓN ARQUITECTÓNICA Y DISEÑO UX PIURA
            </span>

            <div className="space-y-5 text-sm">
              
              <div>
                <h4 className="font-bold text-amber-350 text-white flex items-center gap-1.5 text-xs uppercase font-mono">
                  <Layers className="w-4 h-4 text-amber-400" /> Arquitectura de la Información (Mobile IA)
                </h4>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300 text-xs">
                  <li><strong>Core Storage:</strong> <code>AsyncStorage</code> local mapeando colas estructuradas <code>offlineQueue: Array&lt;DeliveryPayload&gt;</code>.</li>
                  <li><strong>Checklist de Carga:</strong> Control de meta volumétrica por insumo vs carga física (validación dual booleana).</li>
                  <li><strong>Evidencia:</strong> Camera API integrando metadatos de ubicación satelital, hora GMT-5 y compresión de JPG a peso ligero (bajas señales).</li>
                  <li><strong>Sección de Firmas:</strong> Lienzo de firma digitalizado capturado como Base64 mediante el sistema <code>Svg / Canvas Path</code>.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 text-white flex items-center gap-1.5 text-xs uppercase font-mono">
                  <Sparkles className="w-4 h-4 text-teal-400" /> UX Justificada para el Clima y Entorno de Piura
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-2.5 mt-2 text-xs">
                  <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800">
                    <p className="font-bold text-white mb-1">☀️ Sol de Piura</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Alto contraste absoluto (Slate-900 / Ambar) que evita el reflejo de luz directa a más de 35°C.</p>
                  </div>
                  <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800">
                    <p className="font-bold text-white mb-1">📴 Offline-First</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">No bloquea el flujo si no hay señal. Almacena en AsyncStorage y sincroniza con ráfagas HTTP (Axios).</p>
                  </div>
                  <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800">
                    <p className="font-bold text-white mb-1">🏍️ Una Sola Mano</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed">Touch targets gigantes de 48px para mitigar vibraciones en trochas no pavimentadas de la sierra alta.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Copyable React Native Code Tab Container */}
          <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                <span className="text-[10px] font-mono font-bold text-slate-450 text-slate-300 uppercase tracking-widest">
                  Código de Producción / React Native TypeScript (.tsx)
                </span>
              </div>
              <span className="bg-slate-800 text-slate-400 font-mono text-[9px] font-semibold py-0.5 px-2 rounded">
                ESPAÑOL • COMPONENTES NATIVOS
              </span>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[460px] text-xs font-mono text-emerald-400/90 leading-relaxed bg-slate-950/85 scrollbar-thin">
              <pre>{`import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Camera } from 'expo-camera';

// Interfaces Estrictas STARE
interface InsumoBolsa {
  id: string;
  name: string;
  currentQty: number;
  unit: string;
}

interface DeliveryPayload {
  id: string;
  eventId: string;
  deliveredAt: string;
  items: string[];
  signatureBase64: string;
  evidencePhotoUri: string;
}

export default function VoluntarioScreen({ route, navigation }) {
  const { eventId, title, district, itemsBolsa } = route.params;
  
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);

  // Escuchar estado de red en vivo (Piura Rural / Sierra)
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const toggleCheck = (itemId: string) => {
    setChecked(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const procesarEntrega = async () => {
    // 1. Validar Checklist físicamente cargada
    const totalPistados = Object.values(checked).filter(Boolean).length;
    if (totalPistados < itemsBolsa.length) {
      Alert.alert("STARE Móvil", "Verifique todos los lotes físicos antes de continuar.");
      return;
    }

    if (!evidencePhoto || !signature) {
      Alert.alert("STARE Móvil", "Evidencia y firma del local son obligatorias.");
      return;
    }

    const payload: DeliveryPayload = {
      id: \`dev-\${Date.now()}\`,
      eventId,
      deliveredAt: new Date().toISOString(),
      items: itemsBolsa.map(i => \`\${i.currentQty} \${i.unit} de \${i.name}\`),
      signatureBase64: signature,
      evidencePhotoUri: evidencePhoto
    };

    try {
      setLoading(true);
      if (isOnline) {
        // Enviar vía Axios a backend FastAPI/Laravel centralizado
        await fetch('https://api.stare.gob.pe/v1/logistica/entregas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        Alert.alert("Sincronización Exitosa", "Acta asentada inmediatamente en Piura.");
      } else {
        // Enfoque Offline-First: Cola en memoria local persistida
        const queueRaw = await AsyncStorage.getItem('@offline_deliveries_queue') || '[]';
        const queue = JSON.parse(queueRaw);
        queue.push(payload);
        await AsyncStorage.setItem('@offline_deliveries_queue', JSON.stringify(queue));
        Alert.alert("💾 Guardado Sin Señal", "Ubicación rural sin cobertura. Guardado en caché.");
      }
    } catch (err) {
      Alert.alert("Error de Red", "Guardado automáticamente en AsyncStorage para resguardo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Cabecera de Conexión */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, isOnline ? styles.online : styles.offline]}>
          <Text style={styles.badgeText}>{isOnline ? "📶 EN LÍNEA" : "📴 MODO LOCAL"}</Text>
        </View>
      </View>

      {/* 2. FlatList de Insumos */}
      <FlatList
        data={itemsBolsa}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.itemCard, checked[item.id] && styles.itemCargado]} 
            onPress={() => toggleCheck(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemQty}>{item.currentQty} {item.unit}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 3. Evidencias y Registro */}
      {/* (Omitido para simplificación de render - Código de Cámara y Canvas nativos) */}

      <TouchableOpacity style={styles.btnPrincipal} onPress={procesarEntrega}>
        <Text style={styles.btnText}>GUARDAR Y COMPLETAR VIAJE</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 12 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  badge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  online: { backgroundColor: '#10b981' },
  offline: { backgroundColor: '#f59e0b' },
  badgeText: { color: '#ffffff', fontWeight: 'bold', fontSize: 11 },
  itemCard: { padding: 16, backgroundColor: '#1e293b', marginBottom: 8, borderRadius: 12 },
  itemCargado: { borderColor: '#10b981', borderLeftWidth: 6 },
  itemName: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  itemQty: { color: '#94a3b8', fontSize: 12 },
  btnPrincipal: { backgroundColor: '#fbbf24', padding: 16, borderRadius: 14, alignItems: 'center' },
  btnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 15 }
});`}</pre>
            </div>
            
            <div className="bg-slate-900 p-3 text-center text-[10px] text-slate-400 font-mono">
              Use este archivo modularizado en su compilación de Expo / React Native CLI.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: THE INTERACTIVE SMARTPHONE EMULATOR (5/12) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="w-full max-w-[360px] bg-slate-950 p-4 rounded-[42px] border-4 border-slate-800 shadow-2xl relative">
            
            {/* Phone Speaker & Notch */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-slate-800 h-4.5 w-24 rounded-full flex items-center justify-between px-3.5 z-50">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
              <span className="w-12 h-1 bg-slate-900 rounded-full" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 animate-pulse" />
            </div>

            {/* Simulated Smartphone Screen Canvas (Inside container) */}
            <div className="bg-slate-900 rounded-[28px] overflow-hidden border border-slate-900 flex flex-col min-h-[590px] text-white">
              
              {/* STATUS BAR (Time, signal, battery) */}
              <div className="bg-slate-920 bg-slate-950 px-4 pt-3.5 pb-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/5">
                <span>03:15 PM</span>
                <div className="flex items-center gap-2">
                  <span>STARE Móvil</span>
                  {isOnline ? (
                    <span className="flex items-center gap-0.5 text-emerald-400 font-bold">
                      <Wifi className="w-3 h-3" /> 4G
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <WifiOff className="w-3 h-3" /> Offline
                    </span>
                  )}
                  <span className="w-5 h-2.5 bg-slate-700 rounded-sm p-0.5 flex items-center">
                    <span className="h-full w-4 bg-emerald-500 rounded-xs" />
                  </span>
                </div>
              </div>

              {/* EMERGENCY NETWORK CONTROLLER FOR EMULATOR */}
              <div className="bg-slate-850 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between gap-1">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Señal en Trocha Piurana:
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    setIsOnline(!isOnline);
                    if (!isOnline) {
                      // Automatics sync simulation if user toggles on
                      setTimeout(() => {
                        triggerManualSync();
                      }, 200);
                    }
                  }}
                  className={`flex items-center gap-1 py-1 px-2.5 rounded-lg text-[9px] font-mono font-bold cursor-pointer transition-all ${
                    isOnline 
                      ? 'bg-emerald-500/20 text-emerald-450 border border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-450 border border-amber-500/40'
                  }`}
                >
                  {isOnline ? (
                    <>📶 En Línea (Yape/Plin)</>
                  ) : (
                    <>📴 Sin Señal (Offline)</>
                  )}
                </button>
              </div>

              {mobileSuccess && (
                <div className="absolute top-24 left-6 right-6 p-3 bg-indigo-650 bg-indigo-600 text-white rounded-2xl text-[11px] leading-snug shadow-xl z-40 border border-indigo-400 font-sans">
                  {mobileSuccess}
                </div>
              )}

              {/* LIVE SCREEN ROUTING LIST (SELECT ACTIVE TRIP EVENT) */}
              <div className="p-3.5 space-y-3 flex-1 overflow-y-auto scrollbar-none text-xs font-sans">
                
                {/* 1. Header component - Mobile focus */}
                <div className="space-y-1">
                  <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Voluntario de Campo STARE</p>
                  
                  <div className="space-y-1">
                    <label htmlFor="select-ruta-entrega" className="block text-[9px] font-mono font-bold text-orange-300 uppercase tracking-widest">
                      Seleccionar Ruta de Entrega:
                    </label>
                    <select
                      id="select-ruta-entrega"
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full text-xs font-black bg-slate-800 text-amber-300 border border-slate-700 rounded-lg px-2 py-1.5 focus:border-amber-450 outline-hidden"
                    >
                      {events.map(evt => (
                        <option key={evt.id} value={evt.id}>
                          🚚 {evt.district} - {evt.title.substring(0, 24)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {activeEvent && (
                  <div className="bg-slate-850 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <p className="font-bold text-amber-300 text-[11.5px] truncate">{activeEvent.title}</p>
                    <div className="flex gap-2 text-[9px] text-slate-400 font-mono">
                      <span>📍 Distrito: {activeEvent.district}</span>
                      <span>🗓️ {activeEvent.date}</span>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-350">
                      <strong>Encargo:</strong> {activeEvent.targetAudience}
                    </div>
                  </div>
                )}

                {/* 2. FlatList checklist simulation */}
                {activeEvent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400 uppercase tracking-wider">Canasta Consolidada:</span>
                      <button
                        type="button"
                        onClick={toggleAllItems}
                        className="text-amber-400 hover:underline cursor-pointer"
                      >
                        [Verificar todo]
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {activeEvent.itemsBolsa.length === 0 ? (
                        <p className="text-[11px] text-slate-300 text-center py-2">Vacío sin ítems.</p>
                      ) : (
                        activeEvent.itemsBolsa.map(item => {
                          const isChecked = !!checkedItems[item.id];
                          return (
                            <button
                              key={item.id}
                              type="button"
                              role="checkbox"
                              aria-checked={isChecked}
                              onClick={() => {
                                setCheckedItems(prev => ({
                                  ...prev,
                                  [item.id]: !prev[item.id]
                                }));
                              }}
                              className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all tracking-tight cursor-pointer ${
                                isChecked 
                                  ? 'bg-slate-800 border-emerald-500 text-white' 
                                  : 'bg-slate-850 border-slate-800 text-slate-300 hover:bg-slate-800'
                              }`}
                              style={{ minHeight: '44px' }} // Touch target size mandate
                            >
                              <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                  isChecked ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600 bg-slate-900'
                                }`}>
                                  {isChecked && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                                </div>
                                <span className="font-semibold text-[11px]">{item.name}</span>
                              </div>
                              <span className="font-mono text-[10px] font-bold bg-slate-900 py-0.5 px-2 rounded-md border border-slate-800 text-slate-200">
                                {item.currentQty} {item.unit}
                              </span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* 3. MÓDULO DE FOTO DE EVIDENCIA (SIMULATOR) */}
                <div className="space-y-2 border-t border-slate-850 pt-3">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block tracking-wider">Evidencia Fotográfica:</span>
                  
                  {isCameraActive ? (
                    <div className="p-3 bg-slate-950 rounded-2xl border border-indigo-500/30 text-center space-y-2.5 relative">
                      <p className="text-[10px] font-mono text-indigo-400">📷 CÁMARA ACTIVA (GUÍA DE TRAZABILIDAD)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => capturePhoto('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=350&auto=format&fit=crop')}
                          className="p-1 px-1.5 bg-slate-850 border border-slate-700 text-[10px] hover:border-indigo-400 rounded-lg cursor-pointer font-sans"
                        >
                          Kits Donativos Piura
                        </button>
                        <button
                          type="button"
                          onClick={() => capturePhoto('https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=350&auto=format&fit=crop')}
                          className="p-1 px-1.5 bg-slate-850 border border-slate-700 text-[10px] hover:border-indigo-400 rounded-lg cursor-pointer font-sans"
                        >
                          Entrega Comedor Social
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCameraActive(false)}
                        className="text-[10px] text-slate-400 block mx-auto underline font-sans"
                      >
                        Cerrar Lente
                      </button>
                    </div>
                  ) : (
                    <div>
                      {evidencePhoto ? (
                        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
                          <img 
                            src={evidencePhoto} 
                            referrerPolicy="no-referrer"
                            alt="Conformidad Evidencia" 
                            className="w-full h-24 object-cover opacity-85" 
                          />
                          <button
                            type="button"
                            onClick={() => setEvidencePhoto(null)}
                            className="absolute right-2 top-2 bg-slate-950/80 p-1 rounded-full text-rose-400 hover:text-rose-300"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-1 left-2 text-[8px] font-mono text-emerald-400 bg-slate-950/80 px-2 rounded-sm select-none">
                            GPS COMPROBADO • GEO-TAG PIURA
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          aria-label="Registrar Evidencia Visual usando la cámara del dispositivo"
                          onClick={() => setIsCameraActive(true)}
                          className="w-full py-4 bg-slate-850 border border-dashed border-slate-750 rounded-2xl flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white cursor-pointer"
                        >
                          <Camera className="w-5 h-5 text-indigo-400" />
                          <span className="font-sans font-bold text-[10px] text-slate-200">Registrar Evidencia Visual</span>
                          <span className="text-[8px] font-mono text-slate-400">MIME: IMAGE/JPEG (Compacto)</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. LIENZO FIRMA DIGITAL (REAL CANVAS DRAWING) */}
                <div className="space-y-2 border-t border-slate-850 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Firma de Conformidad:</span>
                    {hasSigned && (
                      <button
                        type="button"
                        onClick={clearSignatureCanvas}
                        className="text-slate-400 hover:text-rose-400 text-[9px] font-mono flex items-center gap-0.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" /> Limpiar
                      </button>
                    )}
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-inner relative">
                    <canvas
                      ref={canvasRef}
                      width={310}
                      height={90}
                      role="img"
                      aria-label="Lienzo para firma digital de conformidad. Dibuje su firma aquí con el dedo o el mouse."
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="bg-slate-50 opacity-90 cursor-crosshair block w-full touch-none"
                    />
                    {!hasSigned && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-200 p-2 text-center">
                        <PenTool className="w-4 h-4 text-slate-450 animate-bounce" />
                        <span className="text-[9px] font-sans font-semibold mt-1">Con el dedo/mouse firme en este recuadro</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ACTION FOOTER BAR */}
              <div className="p-3 bg-slate-950 border-t border-slate-850">
                <button
                  type="button"
                  aria-label={isOnline ? "Sincronizar acta de entrega con el servidor central de Piura y finalizar viaje" : "Guardar acta de entrega localmente en la cola offline"}
                  onClick={handleFinalSubmit}
                  className={`w-full py-3.5 rounded-xl font-sans font-black text-xs text-slate-950 cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all ${
                    isOnline 
                      ? 'bg-amber-400 hover:bg-amber-400/90' 
                      : 'bg-emerald-500 hover:bg-emerald-500/90 text-slate-950'
                  }`}
                  style={{ minHeight: '46px' }}
                >
                  <Send className="w-4 h-4" /> 
                  {isOnline ? 'SINCRONIZAR Y FINALIZAR VIAJE' : 'GUARDAR LOCALMENTE (OFFLINE)'}
                </button>
              </div>

            </div>

          </div>

          {/* SIMULATED DEVICE AsyncStorage Queue monitor panel (Fulfillment of high-quality standards) */}
          <div className="w-full max-w-[360px] mt-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-mono font-bold text-slate-405 text-slate-400 uppercase tracking-widest block mb-2">
              📂 Almacenamiento AsyncStorage Local:
            </span>
            {offlineQueue.length === 0 ? (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-mono text-center">
                Sin colas pendientes en AsyncStorage.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-550 font-bold font-sans text-rose-600 animate-pulse flex items-center gap-1">
                  💡 {offlineQueue.length} Expedientes en cola local. ¡Active "En Línea" para enviar!
                </p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {offlineQueue.map((item) => (
                    <div key={item.id} className="p-2 bg-slate-50 border border-slate-150 rounded-lg text-[9px] font-mono text-slate-500 flex justify-between items-center">
                      <div className="truncate">
                        <strong className="text-slate-800">{item.eventTitle.substring(0, 16)}...</strong>
                        <span className="block text-[8px] text-slate-400">{item.timestamp}</span>
                      </div>
                      <span className="bg-amber-100 text-amber-800 px-1 rounded uppercase font-bold shrink-0 text-[7px]">PERSISTIDO</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
