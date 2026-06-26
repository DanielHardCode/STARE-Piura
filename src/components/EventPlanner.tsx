import React, { useState } from 'react';
import { Organization, SocialEvent as LocalSocialEvent } from '../types/organization';
import { SocialEvent as GlobalSocialEvent, BolsaItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  Info, 
  CheckCircle,
  AlertTriangle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  Plus,
  Trash2,
  Users,
  DollarSign,
  Briefcase,
  Layers,
  Heart
} from 'lucide-react';

interface EventPlannerProps {
  organizations: Organization[];
  selectedOrganizationId: string | null;
  onPlanEvent: (event: Omit<LocalSocialEvent, 'id'>) => LocalSocialEvent;
  onSyncGlobalEvent?: (event: GlobalSocialEvent) => void;
  onClose?: () => void;
}

interface SupplyItem {
  product: string;
  meta: number;
  pu: number;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  text: string;
}

export const EventPlanner: React.FC<EventPlannerProps> = ({ 
  organizations, 
  selectedOrganizationId, 
  onPlanEvent,
  onSyncGlobalEvent,
  onClose
}) => {
  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // STEP 1: Identificación y Organización
  const [nombreEvento, setNombreEvento] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [fechaInicio, setFechaInicio] = useState('2026-06-10');
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [fechaFin, setFechaFin] = useState('2026-06-10');
  const [horaFin, setHoraFin] = useState('14:00');
  const [selectedOrgId, setSelectedOrgId] = useState(selectedOrganizationId || '');
  const [problematica, setProblematica] = useState('');

  // STEP 2: Logística y Coordinación
  const [responsable, setResponsable] = useState('');
  const [equipoApoyo, setEquipoApoyo] = useState('');
  const [aliados, setAliados] = useState('');

  // STEP 3: Recursos y Suministros
  const [inputProducto, setInputProducto] = useState('');
  const [inputMeta, setInputMeta] = useState<string>('');
  const [inputPu, setInputPu] = useState<string>('');
  const [suministros, setSuministros] = useState<SupplyItem[]>([
    // Add one initial default item to make it easier or start empty
    { product: 'Kits integrales de alimentos básicos', meta: 20, pu: 32.50 }
  ]);
  const [observacionesLogistica, setObservacionesLogistica] = useState('');

  // Sync selected organization from parent
  React.useEffect(() => {
    if (selectedOrganizationId) {
      setSelectedOrgId(selectedOrganizationId);
    }
  }, [selectedOrganizationId]);

  // Helper: Toast Trigger
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const newToast = { id: `toast-${Date.now()}`, type, text };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  // Step validation
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!nombreEvento.trim()) {
        triggerToast('Por favor ingrese el nombre del evento', 'warning');
        return false;
      }
      if (!fechaInicio.trim() || !fechaFin.trim()) {
        triggerToast('Debe ingresar las fechas de inicio y finalización', 'warning');
        return false;
      }
      if (!selectedOrgId) {
        triggerToast('Debe seleccionar una organización beneficiaria', 'warning');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    setNombreEvento('');
    setTipoEvento('');
    setFechaInicio('2026-06-10');
    setHoraInicio('09:00');
    setFechaFin('2026-06-10');
    setHoraFin('14:00');
    setSelectedOrgId('');
    setProblematica('');
    setResponsable('');
    setEquipoApoyo('');
    setAliados('');
    setInputProducto('');
    setInputMeta('');
    setInputPu('');
    setSuministros([{ product: 'Kits integrales de alimentos básicos', meta: 20, pu: 32.50 }]);
    setObservacionesLogistica('');
    setStep(1);
    setShowCancelModal(false);
    if (onClose) onClose();
  };

  // Add item of Step 3
  const handleAddSuministro = () => {
    if (!inputProducto.trim()) {
      triggerToast('Ingrese el nombre del producto', 'warning');
      return;
    }
    const metaVal = parseInt(inputMeta);
    if (isNaN(metaVal) || metaVal < 1) {
      triggerToast('Ingrese una cantidad válida mayor o igual a 1', 'warning');
      return;
    }
    const puVal = parseFloat(inputPu);
    if (isNaN(puVal) || puVal < 0) {
      triggerToast('Ingrese un precio unitario válido', 'warning');
      return;
    }

    const newItem: SupplyItem = {
      product: inputProducto.trim(),
      meta: metaVal,
      pu: puVal
    };

    setSuministros(prev => [...prev, newItem]);
    
    // Clear inputs
    setInputProducto('');
    setInputMeta('');
    setInputPu('');
    
    triggerToast(`Suministro "${newItem.product}" agregado`, 'success');
  };

  const handleRemoveSuministro = (idx: number) => {
    const deleted = suministros[idx];
    setSuministros(prev => prev.filter((_, i) => i !== idx));
    triggerToast(`Suministro "${deleted.product}" eliminado`, 'info');
  };

  // Calculations
  const totalPresupuesto = suministros.reduce((acc, s) => acc + (s.meta * s.pu), 0);

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(1)) return;

    if (suministros.length === 0) {
      triggerToast('Debe agregar al menos un suministro en la Bolsa de Evento', 'warning');
      return;
    }

    const selectedOrg = organizations.find(o => o.id === selectedOrgId);
    if (!selectedOrg) {
      triggerToast('Organización beneficiaria no encontrada', 'warning');
      return;
    }

    // 1. Post to local state matching layout
    const localEvt = onPlanEvent({
      organization_id: selectedOrgId,
      fecha_programada: fechaInicio,
      tipo_intervencion: (tipoEvento.toLowerCase().includes('infraestructura') ? 'infraestructura' : tipoEvento.toLowerCase().includes('educ') ? 'educativa' : 'acompañamiento'),
      estado: 'pendiente',
      voluntarios_requeridos: Math.max(1, parseInt(equipoApoyo.split(',').length.toString()) || 4)
    });

    // 2. Synchronize to global calendar of CommandCenterLogistico
    if (onSyncGlobalEvent) {
      // Map supply items to BolsaItem of CommandCenter
      const mappedBolsaItems: BolsaItem[] = suministros.map((item, i) => ({
        id: `bi-sync-${Date.now()}-${i}`,
        name: item.product,
        unit: 'unidades',
        targetQty: item.meta,
        currentQty: 0,
        unitPriceEstimate: item.pu
      }));

      // Map to SocialEvent of CommandCenter
      const globalEvt: GlobalSocialEvent = {
        id: `ev-sync-${Date.now()}`,
        title: nombreEvento.trim(),
        description: problematica.trim() || `Intervención de labor social en ${selectedOrg.nombre}. Responsable: ${responsable || 'Dirección STARE'}.`,
        date: fechaInicio,
        district: (selectedOrg.distrito as any) || 'Piura Centro',
        targetAudience: selectedOrg.sector_demografico || 'Población general',
        status: 'programado',
        itemsBolsa: mappedBolsaItems
      };

      onSyncGlobalEvent(globalEvt);
    }

    triggerToast('¡Evento guardado y sincronizado con el cronograma!', 'success');

    // Auto close
    setTimeout(() => {
      confirmCancel();
    }, 1000);
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full mx-auto relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
            <Calendar className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-sans font-black text-slate-800 uppercase tracking-tight">
              PROGRAMAR NUEVO EVENTO (PIURA)
            </h3>
            <p className="text-[11px] font-medium text-slate-400">
              Crea una nueva jornada de apoyo vinculada a una institución piurana
            </p>
          </div>
        </div>
        
        {/* Close button X */}
        <button 
          onClick={handleCancelClick}
          className="p-1 px-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-all border border-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* STEP PROGRESS BAR */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span className={step >= 1 ? 'text-amber-600' : ''}>1. Identificación</span>
          <span className={step >= 2 ? 'text-amber-600' : ''}>2. Logística</span>
          <span className={step >= 3 ? 'text-amber-600' : ''}>3. Recursos</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
          <div 
            className="h-full bg-amber-500 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* FORM CONTENT */}
      <div className="min-h-[290px]">
        {/* STEP 1: Identificación y Organización Beneficiaria */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-650" />
              <p>
                <strong>Paso 1:</strong> Vincula y programa el evento. La ubicación y poblaciones beneficiarias se heredan directamente de la organización para mayor agilidad operativa.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Nombre del Evento *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Campaña Médica y Entrega de Alimentos - Sechura"
                  value={nombreEvento}
                  onChange={(e) => setNombreEvento(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Tipo de Evento
                </label>
                <input
                  type="text"
                  placeholder="Ej. Campaña de salud, Apoyo alimentario, Refacción escolar"
                  value={tipoEvento}
                  onChange={(e) => setTipoEvento(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Organización beneficiaria *
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 bg-white font-sans font-bold text-slate-800 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="" disabled>-- Selecciona una institución registrada --</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.nombre} ({org.distrito})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Descripción del Problema o Necesidad
                </label>
                <textarea
                  rows={1.5}
                  value={problematica}
                  onChange={(e) => setProblematica(e.target.value)}
                  placeholder="Explique la problemática social que se busca atender..."
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 bg-slate-55 p-3 rounded-2xl border border-slate-200/60">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Fecha Inicio *
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Hora Inicio
                </label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Hora Fin
                </label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850 font-bold"
                />
              </div>
            </div>

            <input type="hidden" value={fechaFin} />
          </div>
        )}

        {/* STEP 2: Logística y Coordinación */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <Users className="w-4 h-4 shrink-0 text-amber-505 text-amber-600" />
              <p>
                <strong>Paso 2:</strong> Coordinación operativa del talento y alianzas institucionales para respaldar el recorrido de la ayuda alimentaria en Piura.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Responsable del Evento
              </label>
              <input
                type="text"
                placeholder="Nombre de la persona que lidera la actividad"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Equipo de Apoyo (Colaboradores / Voluntarios separados por comas)
              </label>
              <textarea
                rows={2}
                placeholder="Ej. Juan Pérez, Carmen Rojas, Luis Abad"
                value={equipoApoyo}
                onChange={(e) => setEquipoApoyo(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Aliados o Instituciones Participantes
              </label>
              <input
                type="text"
                placeholder="Otras organizaciones que colaboran (ej. Municipalidad, Parroquia local)"
                value={aliados}
                onChange={(e) => setAliados(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Recursos y Suministros */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-2 text-[10.5px] leading-relaxed text-slate-600 flex gap-1.5">
              <Layers className="w-4 h-4 shrink-0 text-amber-600" />
              <p>
                <strong>Paso 3:</strong> Presupuestación de la Bolsa de Evento. Registre los insumos detallados para balancear brechas de inventario de forma automática.
              </p>
            </div>

            {/* 3.1. Agregar suministros form area */}
            <div className="p-4 bg-amber-50/20 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="text-[10px] font-bold font-mono text-slate-600 uppercase tracking-wide">
                + Agregar Insumo a la Bolsa
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Producto (ej. Aceite vegetal)"
                    value={inputProducto}
                    onChange={(e) => setInputProducto(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-250 bg-white"
                  />
                </div>
                <div className="sm:col-span-1.5">
                  <input
                    type="number"
                    min="1"
                    placeholder="Meta cant"
                    value={inputMeta}
                    onChange={(e) => setInputMeta(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-250 bg-white"
                  />
                </div>
                <div className="sm:col-span-1.5">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="P.U. (S/)"
                    value={inputPu}
                    onChange={(e) => setInputPu(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-250 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddSuministro}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold leading-none cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Añadir
                </button>
              </div>
            </div>

            {/* 3.2. Suministros table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-[10.5px] font-sans text-left">
                <thead className="bg-slate-50 font-mono text-slate-500 uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2">Insumo</th>
                    <th className="px-3 py-2 text-center">Meta</th>
                    <th className="px-3 py-2 text-right">P.U. (S/)</th>
                    <th className="px-3 py-2 text-right">Subtotal</th>
                    <th className="px-3 py-2 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700 bg-white">
                  {suministros.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-normal">
                        Ningún insumo de ayuda agregado aún. Agréguelos en el cuadro de arriba.
                      </td>
                    </tr>
                  ) : (
                    suministros.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-4 py-2 font-bold max-w-[12rem] truncate">{item.product}</td>
                        <td className="px-3 py-2 text-center font-mono">{item.meta}</td>
                        <td className="px-3 py-2 text-right font-mono">S/. {item.pu.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right font-bold font-mono">S/. {(item.meta * item.pu).toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSuministro(idx)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Total Budget calculation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-3 mb-3 text-xs gap-2">
              <div className="font-mono text-[10.5px] text-slate-500">
                PRESUPUESTO TOTAL ESTIMADO:
              </div>
              <div className="text-base font-black text-indigo-700 font-mono bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl">
                S/. {totalPresupuesto.toFixed(2)} PEN
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Observaciones de Logística
              </label>
              <textarea
                rows={1.5}
                placeholder="Notas sobre transporte, refrigeración, almacenamiento o instalación..."
                value={observacionesLogistica}
                onChange={(e) => setObservacionesLogistica(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
        <div>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 border-2 border-slate-200 hover:border-slate-900 text-slate-700 bg-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2.5 text-rose-650 hover:bg-rose-50 border border-slate-250 hover:border-rose-350 text-xs font-bold uppercase rounded-xl transition-all font-sans cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>

        <div>
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-xs"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveEvent}
              className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-650 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md shrink-0"
            >
              <Save className="w-4 h-4" /> Guardar Evento
            </button>
          )}
        </div>
      </div>

      {/* FLOAT TOASTS NOTIFIERS */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[99] flex flex-col gap-2 max-w-sm w-full font-sans">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`p-3.5 rounded-2xl border-2 flex items-start gap-2.5 shadow-lg animate-slide-in text-xs font-bold text-slate-900 ${
                toast.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950' 
                  : toast.type === 'warning'
                  ? 'bg-rose-50 border-rose-500 text-rose-950'
                  : 'bg-indigo-50 border-indigo-500 text-indigo-950'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-650 mt-0.5 shrink-0" />}
              {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-rose-650 mt-0.5 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-650 mt-0.5 shrink-0" />}
              
              <div className="flex-1 text-left">{toast.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* CONFIRMATION OVERLAY MODAL */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-[100] animate-fade-in font-sans">
          <div className="bg-white border-4 border-slate-950 p-6 rounded-3xl max-w-sm w-full text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            <div className="mx-auto w-12 h-12 bg-rose-50 border border-rose-300 text-rose-600 rounded-full flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight mb-2">
              ¿Cancelar la programación?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 mb-5">
              Si sales ahora se perderán todos los datos y la Bolsa de Evento de este cronograma en evaluación.
            </p>

            <div className="flex gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="py-2 px-4 border-2 border-slate-200 hover:border-slate-900 text-slate-700 bg-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all"
              >
                Salir de todas formas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
