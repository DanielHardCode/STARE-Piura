import React, { useState } from 'react';
import { useOrganizationManagement } from '../hooks/useOrganizationManagement';
import { OrganizationForm } from './OrganizationForm';
import { EventPlanner } from './EventPlanner';
import { 
  Building2, 
  MapPin, 
  Sparkles, 
  ShieldAlert, 
  Users, 
  Calendar, 
  PlusCircle,
  Eye,
  CheckCircle,
  Filter,
  Trash2,
  Edit2,
  ListPlus,
  HelpCircle,
  Search
} from 'lucide-react';
import { Organization, SocialEvent as LocalSocialEvent } from '../types/organization';
import { SocialEvent as GlobalSocialEvent } from '../types';

interface OrganizationManagerProps {
  onSyncGlobalEvent?: (event: GlobalSocialEvent) => void;
}

export const OrganizationManager: React.FC<OrganizationManagerProps> = ({ onSyncGlobalEvent }) => {
  const {
    organizations,
    orgEvents,
    addOrganization,
    updateOrganization,
    addSocialEvent,
    updateEventStatus,
    deleteOrganization
  } = useOrganizationManagement();

  // Modals Toggles
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [filterDistrict, setFilterDistrict] = useState<string>('todos');

  const [searchQuery, setSearchQuery] = useState('');

  // Directory Stats
  const totalOrgs = organizations.length;
  const totalVolunteersNeeded = orgEvents.reduce((acc, curr) => acc + curr.voluntarios_requeridos, 0);

  // Filtered organizations
  const filteredOrgs = organizations.filter(org => {
    const matchDistrict = filterDistrict === 'todos' || org.distrito === filterDistrict;
    
    const orgName = org.nombre || '';
    const orgAddress = org.direccion || '';
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    
    const matchSearch = orgName.toLowerCase().includes(query) || 
                        orgAddress.toLowerCase().includes(query);
    return matchDistrict && matchSearch;
  });

  const uniqueDistricts = Array.from(new Set(organizations.map(o => o.distrito)));

  return (
    <div className="space-y-6">
      
      {/* HEADER STATISTICS DISPLAY CARD */}
      <div className="bg-slate-900 border-2 border-slate-950 p-6 rounded-3xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono bg-amber-500 font-bold text-slate-950 px-2.5 py-1 rounded-md tracking-wider">
            Demografía y Planificación Desacoplada
          </span>
          <h2 className="text-xl font-sans font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            Gestión de Organizaciones y Eventos
          </h2>
          <p className="text-xs text-slate-350">
            Mapeo de necesidades en Piura coordinado con el Command-Center Logístico.
          </p>
        </div>
        
        {/* Quick regional stats indicators */}
        <div className="flex gap-2.5 bg-slate-800/60 p-2 rounded-2xl border border-slate-700 w-full md:w-auto overflow-x-auto">
          <div className="text-center px-3 border-r border-slate-700 shrink-0 min-w-[5.5rem]">
            <span className="text-[9px] block text-slate-400 font-mono">ORGANIZACIONES</span>
            <span className="text-base font-black text-amber-400">{totalOrgs}</span>
          </div>
          <div className="text-center px-3 shrink-0 min-w-[5.5rem]">
            <span className="text-[9px] block text-slate-400 font-mono">COBERTURA VOL.</span>
            <span className="text-base font-black text-emerald-400">{totalVolunteersNeeded}</span>
          </div>
        </div>
      </div>

      {/* ACTION QUICK BAR (BUTTONS TO TRIGGER THE RE-DIESGNED WIZARD FORMS) */}
      <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-left">
          <h3 className="font-sans font-black text-xs uppercase text-slate-800">
            Herramientas Operativas de Programación
          </h3>
          <p className="text-[11px] font-medium text-slate-400">
            Formaliza nuevas instituciones o coordina una nueva jornada en el calendario.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setShowOrgForm(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-650 bg-indigo-600 hover:bg-indigo-750 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 shrink-0" /> Añadir Organización
          </button>
          
          <button
            onClick={() => setShowEventForm(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
          >
            <ListPlus className="w-4 h-4 shrink-0" /> Registrar nuevo evento
          </button>
        </div>
      </div>

      {/* CORE COLUMNS: DIRECTORY IN 100% WIDTH FLUID CHASSIS */}
      <div className="grid grid-cols-1 gap-6 items-start">
        
        {/* DISTRICT DIRECTORY COLUMN */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b-2 border-slate-900 pb-1.5">
            <h3 className="text-xs font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Directorio de Organizaciones Evaluadas ({filteredOrgs.length})
            </h3>
            
            {/* DIRECTORY FILTERS */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar organización..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-48 text-[11px] py-1.5 pl-8 pr-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:outline-hidden text-slate-800"
                />
              </div>
              <Filter className="w-3.5 h-3.5 text-slate-500 hidden sm:block ml-1" />
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 rounded-lg py-1 px-2 focus:outline-hidden cursor-pointer"
              >
                <option value="todos">Todos Distritos</option>
                {uniqueDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>


            </div>
          </div>

          {/* LIST OF CARDS */}
          {filteredOrgs.length === 0 ? (
            <div className="p-8 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 text-xs">
              Ninguna organización registrada coincide con las combinaciones de filtrado seleccionadas.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredOrgs.map((org) => {
                const isSelected = selectedOrgId === org.id;
                return (
                  <div
                    key={org.id}
                    onClick={() => setSelectedOrgId(org.id)}
                    className={`relative bg-white border-2 rounded-2xl p-4 flex flex-col justify-between transition-all text-left cursor-pointer ${
                      isSelected 
                        ? 'border-slate-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-amber-50/10' 
                        : 'border-slate-200 hover:border-slate-450'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2.5 mb-2">
                        <div className="min-w-0">
                          <span className="text-[9px] font-mono text-slate-400 block mb-0.5">ID: {org.id}</span>
                          <h4 className="font-sans font-black text-xs text-slate-800 uppercase tracking-tight truncate leading-tight">
                            {org.nombre}
                          </h4>
                          <p className="text-[10.5px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-indigo-505 text-indigo-500 shrink-0" />
                            {org.direccion}
                          </p>
                        </div>


                      </div>

                      {/* Info and weaknesses */}
                      <div className="mt-3 space-y-1 bg-slate-50 border border-slate-150 p-2.5 rounded-xl text-[10px]">
                        <p className="text-slate-600 font-medium">
                          🎯 Público: <strong>{org.sector_demografico}</strong>
                        </p>
                        <p className="text-slate-600 leading-normal font-medium">
                          📍 Distrito: <strong>{org.distrito}</strong>
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                          {(org.deficiencias_infraestructura || []).map((def, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-slate-200 text-slate-705 text-slate-700 py-0.5 px-2 rounded-md font-bold inline-flex items-center gap-1 text-[9px]"
                            >
                              ⚠️ {def}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions inside card */}
                    <div className="mt-4 flex justify-between items-center pt-2 border-t border-slate-100">
                      <span className="text-[9.5px] font-mono font-bold text-slate-400">
                        {isSelected ? '👉 Seleccionada' : 'Seleccionar'}
                      </span>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrgId(isSelected ? null : org.id);
                          }}
                          className={`px-2.5 py-1 border rounded-lg font-mono font-bold text-[9px] uppercase cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-slate-900 border-slate-900 text-white' 
                              : 'bg-white border-slate-200 hover:border-slate-800 text-slate-700'
                          }`}
                        >
                          {isSelected ? '✓ Activa' : 'Fijar'}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingOrg(org);
                          }}
                          className="p-1 px-1.5 text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg hover:border-indigo-300 transition-all cursor-pointer"
                          title="Editar organización"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrganization(org.id);
                            if (selectedOrgId === org.id) setSelectedOrgId(null);
                          }}
                          className="p-1 px-1.5 text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg hover:border-rose-300 transition-all cursor-pointer"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* MODAL LIGHT OVERLAY FOR WIZARD FORM: ORGANIZATION */}
      {(showOrgForm || editingOrg) && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
          <div className="py-8 max-w-2xl w-full">
            <OrganizationForm 
              initialData={editingOrg || undefined}
              onRegister={(org) => {
                if (editingOrg) {
                  updateOrganization(editingOrg.id, org);
                  setEditingOrg(null);
                } else {
                  addOrganization(org);
                  setShowOrgForm(false);
                }
              }}
              onClose={() => {
                setShowOrgForm(false);
                setEditingOrg(null);
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL LIGHT OVERLAY FOR WIZARD FORM: SOCIAL EVENT */}
      {showEventForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
          <div className="py-8 max-w-2xl w-full">
            <EventPlanner 
              organizations={organizations}
              selectedOrganizationId={selectedOrgId}
              onPlanEvent={(evt) => {
                return addSocialEvent(evt);
              }}
              onSyncGlobalEvent={(globalEvt) => {
                if (onSyncGlobalEvent) {
                  onSyncGlobalEvent(globalEvt);
                }
              }}
              onClose={() => setShowEventForm(false)}
            />
          </div>
        </div>
      )}

    </div>
  );
};
