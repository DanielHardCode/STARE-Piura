import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  PlusCircle, 
  Edit, 
  X, 
  Search, 
  Trash2, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Sparkles,
  AlertCircle,
  Activity,
  Building2
} from 'lucide-react';
import { useEventStore } from '@/stores/events';
import { useOrganizationStore } from '@/stores/organizations';
import { useOrganizationManagement } from '../hooks/useOrganizationManagement';
import { EventPlanner } from './EventPlanner';
import { motion, AnimatePresence } from 'motion/react';
import { EventWithBolsa, PiuraDistrict } from '@/types/index';

export const EventManager: React.FC = () => {
  const {
    events,
    fetchEvents,
    addEvent,
    updateEvent,
    loading
  } = useEventStore();

  const {
    organizations: storeOrganizations,
    fetchOrganizations
  } = useOrganizationStore();

  const { 
    organizations: adaptedOrgs, 
    addSocialEvent 
  } = useOrganizationManagement();

  useEffect(() => {
    fetchEvents();
    fetchOrganizations();
  }, [fetchEvents, fetchOrganizations]);

  // Modals Toggles
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Paginación
  const [pageSize, setPageSize] = useState<number>(10);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Modal de Edición de Evento
  const [editingEvent, setEditingEvent] = useState<EventWithBolsa | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDistrict, setEditDistrict] = useState<PiuraDistrict | ''>('');
  const [editAudience, setEditAudience] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Stats
  const totalEvents = events.length;
  const activeEvents = events.filter(e => e.status === 'en_curso' || e.status === 'programada').length;
  const completedEvents = events.filter(e => e.status === 'realizada').length;

  // Filtered Events
  const filteredEvents = events.filter(evt => {
    const org = storeOrganizations.find(o => o.id === evt.organization_id);
    const orgName = org ? org.nombre : '';
    
    const matchSearch = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.description && evt.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDistrict = filterDistrict === 'todos' || evt.distrito === filterDistrict;
    const matchStatus = filterStatus === 'todos' || evt.status === filterStatus;

    return matchSearch && matchDistrict && matchStatus;
  });

  const uniqueDistricts = Array.from(new Set(events.map(e => e.distrito).filter(Boolean)));

  // Paginación lógica
  const displayedEvents = pageSize === -1 
    ? filteredEvents 
    : filteredEvents.slice(0, visibleCount);

  // Open Edit Modal
  const handleOpenEdit = (evt: EventWithBolsa) => {
    setEditingEvent(evt);
    setEditTitle(evt.title);
    setEditDescription(evt.description || '');
    setEditDistrict((evt.distrito as PiuraDistrict) || '');
    setEditAudience(evt.target_audience || '');
    setEditStatus(evt.status);
    setEditStartTime(evt.start_time.split('T')[0]);
    setEditErrorMsg(null);
  };

  // Submit Update Event
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg(null);

    if (!editTitle.trim()) {
      setEditErrorMsg('El título es obligatorio.');
      return;
    }

    try {
      await useEventStore.getState().updateEvent(editingEvent!.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        distrito: editDistrict as PiuraDistrict,
        target_audience: editAudience.trim(),
        status: editStatus as any,
        start_time: editStartTime ? `${editStartTime}T09:00:00` : new Date().toISOString()
      });

      setSuccessMsg(`✅ ¡Jornada "${editTitle.trim()}" actualizada con éxito!`);
      setEditingEvent(null);

      // Refrescar
      await fetchEvents();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Error al actualizar la jornada.');
    }
  };

  // Quick State Updates (Iniciar / Completar)
  const handleQuickStatusChange = async (evtId: string, nextStatus: 'en_curso' | 'realizada' | 'cancelada') => {
    try {
      await updateEvent(evtId, { status: nextStatus });
      setSuccessMsg(`✅ Estado de la jornada actualizado a: ${nextStatus.toUpperCase()}`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Error al actualizar estado: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER STATISTICS DISPLAY CARD */}
      <div className="bg-slate-900 border-2 border-slate-950 p-6 rounded-3xl text-white shadow-[var(--shadow-md)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono bg-amber-500 font-bold text-slate-950 px-2.5 py-1 rounded-md tracking-wider">
            Cronograma y Cobertura
          </span>
          <h2 className="text-xl font-sans font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            Control de Jornadas y Eventos Zonal
          </h2>
          <p className="text-xs text-slate-400">
            Administración de actividades comunitarias y entregas de víveres programadas.
          </p>
        </div>
        
        {/* Quick regional stats indicators */}
        <div className="flex gap-2.5 bg-slate-800/60 p-2 rounded-2xl border border-slate-700 w-full md:w-auto overflow-x-auto">
          <div className="text-center px-4 border-r border-slate-700 shrink-0 min-w-[7rem]">
            <span className="text-[9px] block text-slate-400 font-mono">TOTAL JORNADAS</span>
            <span className="text-base font-black text-amber-400">{totalEvents}</span>
          </div>
          <div className="text-center px-4 border-r border-slate-700 shrink-0 min-w-[7rem]">
            <span className="text-[9px] block text-slate-400 font-mono">PENDIENTES / CURSO</span>
            <span className="text-base font-black text-teal-400">{activeEvents}</span>
          </div>
          <div className="text-center px-4 shrink-0 min-w-[7rem]">
            <span className="text-[9px] block text-slate-400 font-mono">COMPLETADAS</span>
            <span className="text-base font-black text-emerald-400">{completedEvents}</span>
          </div>
        </div>
      </div>

      {/* ACTION QUICK BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="text-left">
          <h3 className="font-sans font-black text-xs uppercase text-slate-850">
            Planificación de Intervenciones Sociales
          </h3>
          <p className="text-[11px] font-medium text-slate-400">
            Planifica una nueva jornada de apoyo alimentario vinculada a una institución.
          </p>
        </div>
        
        <button
          onClick={() => setShowEventForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 shrink-0" /> Planificar Jornada
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <p>{successMsg}</p>
        </div>
      )}

      {/* FILTER & SEARCH PRESET */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Título de Jornada u Organización..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 pl-9 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden text-slate-805 text-slate-800"
          />
        </div>

        {/* District Filter Selector */}
        <div className="sm:col-span-3 select-wrapper">
          <select
            value={filterDistrict}
            onChange={(e) => {
              setFilterDistrict(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-808 text-slate-800 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="todos">🚚 Todos los Distritos</option>
            {uniqueDistricts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Status Filter Selector */}
        <div className="sm:col-span-3 select-wrapper">
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-808 text-slate-800 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="todos">⚙️ Todos los Estados</option>
            <option value="programada">Programado</option>
            <option value="en_curso">En Curso</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

      </div>

      {/* Pagination metrics bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-100 pb-2">
        <span>Mostrando {displayedEvents.length} de {filteredEvents.length} jornadas sociales</span>
        <div className="flex items-center gap-2">
          <span>Ver:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setPageSize(size);
              setVisibleCount(size === -1 ? filteredEvents.length : size);
            }}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value={10}>10 en 10</option>
            <option value={20}>20 en 20</option>
            <option value={50}>50 en 50</option>
            <option value={-1}>Todos</option>
          </select>
        </div>
      </div>

      {/* LIST OF CARDS */}
      {displayedEvents.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center text-slate-450 text-slate-400 text-xs">
          Ningún evento social registrado coincide con los términos de búsqueda o filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedEvents.map((evt) => {
            const org = storeOrganizations.find(o => o.id === evt.organization_id);
            return (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3.5 text-left flex flex-col justify-between hover:border-slate-350 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2.5">
                    <span className={`text-[8.5px] font-mono font-bold uppercase tracking-wider py-0.5 px-2 rounded-md ${
                      evt.status === 'realizada' 
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                        : evt.status === 'en_curso' 
                        ? 'bg-indigo-50 border border-indigo-250 text-indigo-800' 
                        : 'bg-amber-50 border border-amber-250 text-amber-800'
                    }`}>
                      ● {evt.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 font-mono">ID: {evt.id}</span>
                  </div>

                  <h4 className="font-sans font-black text-xs text-slate-900 uppercase mt-2 leading-tight">
                    {evt.title}
                  </h4>
                  {org && (
                    <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-tight mt-1 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      {org.nombre}
                    </p>
                  )}
                  {evt.description && (
                    <p className="text-[11px] text-slate-505 text-slate-500 leading-relaxed mt-2.5 line-clamp-2">
                      "{evt.description}"
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10.5px] font-mono text-slate-500 border-t border-b py-2 my-1.5 border-slate-100 bg-slate-50/50 px-2 rounded-xl">
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-mono">FECHA JORNADA</p>
                      <p className="font-bold text-slate-800">{evt.start_time.split('T')[0]}</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-mono">DISTRITO</p>
                      <p className="font-bold text-slate-850 truncate">{evt.distrito || 'Piura'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Público: {evt.target_audience || 'Vulnerable'}</span>
                    <span className="font-mono bg-slate-100 py-0.5 px-2 rounded font-bold text-slate-700">{evt.supply_items.length} Insumos Bolsa</span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex gap-1">
                    {evt.status === 'programada' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(evt.id, 'en_curso')}
                        className="bg-slate-900 hover:bg-slate-850 text-white font-mono font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Iniciar
                      </button>
                    )}
                    {evt.status === 'en_curso' && (
                      <button
                        type="button"
                        onClick={() => handleQuickStatusChange(evt.id, 'realizada')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[9px] uppercase px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shadow-3xs"
                      >
                        Completar
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(evt)}
                      className="p-1 px-1.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg hover:border-slate-450 transition-colors cursor-pointer"
                      title="Editar Jornada"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Button to load more */}
      {pageSize !== -1 && filteredEvents.length > visibleCount && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + pageSize, filteredEvents.length))}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Ver más Jornadas (+{Math.min(pageSize, filteredEvents.length - visibleCount)})
          </button>
        </div>
      )}

      {/* PLANNER MODAL */}
      {showEventForm && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
          <div className="py-8 max-w-2xl w-full">
            <EventPlanner 
              organizations={adaptedOrgs}
              selectedOrganizationId={null}
              onPlanEvent={addSocialEvent}
              onClose={() => setShowEventForm(false)}
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-3xl max-w-lg w-full relative border border-white/10 shadow-2xl text-slate-800"
            >
              <button
                onClick={() => setEditingEvent(null)}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-655 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-indigo-650" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Editar Jornada: {editingEvent.title}
                </h4>
              </div>

              {editErrorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-850 rounded-xl text-xs flex items-center gap-1.5 mb-4">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <p className="font-medium">{editErrorMsg}</p>
                </div>
              )}

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Título de la Jornada
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Descripción / Encargo
                  </label>
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Fecha programada
                    </label>
                    <input
                      type="date"
                      required
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Distrito
                    </label>
                    <select
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value as PiuraDistrict)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="Piura Centro">Piura Centro</option>
                      <option value="Catacaos">Catacaos</option>
                      <option value="Castilla">Castilla</option>
                      <option value="Veintiséis de Octubre">Veintiséis de Octubre</option>
                      <option value="Tambogrande">Tambogrande</option>
                      <option value="Chulucanas">Chulucanas</option>
                      <option value="Sechura">Sechura</option>
                      <option value="Paita">Paita</option>
                      <option value="Talara">Talara</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Público Objetivo
                    </label>
                    <input
                      type="text"
                      value={editAudience}
                      onChange={(e) => setEditAudience(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Estado
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="programada">Programado</option>
                      <option value="en_curso">En curso</option>
                      <option value="realizada">Realizada</option>
                      <option value="cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-105 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
