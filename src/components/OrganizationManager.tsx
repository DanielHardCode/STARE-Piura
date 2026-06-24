import React, { useState } from 'react';
import { useOrganizationManagement } from '../hooks/useOrganizationManagement';
import { OrganizationForm } from './OrganizationForm';
import { 
  Building2, 
  MapPin, 
  Users, 
  PlusCircle,
  Eye,
  Filter,
  Trash2,
  HelpCircle,
  Search,
  Edit,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Organization, PriorityLevel } from '../types/organization';
import { PiuraDistrict } from '@/types/index';
import { useOrganizationStore } from '@/stores/organizations';
import { motion, AnimatePresence } from 'motion/react';

export const OrganizationManager: React.FC = () => {
  const {
    organizations,
    addOrganization,
    deleteOrganization
  } = useOrganizationManagement();

  // Modals Toggles
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState<string>('todos');
  const [filterPriority, setFilterPriority] = useState<string>('todos');

  // Paginación
  const [pageSize, setPageSize] = useState<number>(10);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Modal de Edición de Organización
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDireccion, setEditDireccion] = useState('');
  const [editDistrito, setEditDistrito] = useState<PiuraDistrict | ''>('');
  const [editSector, setEditSector] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityLevel>('alta');
  const [editDeficiencias, setEditDeficiencias] = useState('');
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Directory Stats
  const totalOrgs = organizations.length;
  const highPriorityOrgs = organizations.filter(o => o.nivel_prioridad === 'alta').length;

  // Filtered organizations
  const filteredOrgs = organizations.filter(org => {
    const matchSearch = 
      org.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.direccion.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchDistrict = filterDistrict === 'todos' || org.distrito === filterDistrict;
    const matchPriority = filterPriority === 'todos' || org.nivel_prioridad === filterPriority;
    return matchSearch && matchDistrict && matchPriority;
  });

  const uniqueDistricts = Array.from(new Set(organizations.map(o => o.distrito).filter(Boolean)));

  // Paginación lógica
  const displayedOrgs = pageSize === -1 
    ? filteredOrgs 
    : filteredOrgs.slice(0, visibleCount);

  // Open Edit Modal
  const handleOpenEdit = (org: Organization) => {
    setEditingOrg(org);
    setEditNombre(org.nombre);
    setEditDireccion(org.direccion);
    setEditDistrito((org.distrito as PiuraDistrict) || '');
    setEditSector(org.sector_demografico);
    setEditPriority(org.nivel_prioridad);
    setEditDeficiencias(org.deficiencias_infraestructura.join(', '));
    setEditErrorMsg(null);
  };

  // Submit Update Organization
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg(null);

    if (!editNombre.trim()) {
      setEditErrorMsg('El Nombre es obligatorio.');
      return;
    }

    try {
      const defs = editDeficiencias
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const tipo = editSector.toLowerCase().includes('comedor')
        ? 'comedor'
        : editSector.toLowerCase().includes('asilo')
        ? 'asilo'
        : editSector.toLowerCase().includes('vaso')
        ? 'vaso_de_leche'
        : 'otro';

      await useOrganizationStore.getState().updateOrganization(editingOrg!.id, {
        nombre: editNombre.trim(),
        direccion: editDireccion.trim(),
        distrito: editDistrito as PiuraDistrict,
        tipo: tipo as any,
        necesidades: defs
      });

      setSuccessMsg(`✅ ¡Organización "${editNombre.trim()}" actualizada con éxito!`);
      setEditingOrg(null);

      // Refrescar
      await useOrganizationStore.getState().fetchOrganizations();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Error al actualizar la organización.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER STATISTICS DISPLAY CARD */}
      <div className="bg-slate-900 border-2 border-slate-950 p-6 rounded-3xl text-white shadow-[var(--shadow-md)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono bg-amber-500 font-bold text-slate-950 px-2.5 py-1 rounded-md tracking-wider">
            Demografía y Beneficiarios
          </span>
          <h2 className="text-xl font-sans font-black uppercase tracking-tight mt-1.5 flex items-center gap-2">
            Gestión de Organizaciones Beneficiarias
          </h2>
          <p className="text-xs text-slate-400">
            Mapeo de comedores y ollas populares en Piura coordinado con el Command-Center Logístico.
          </p>
        </div>
        
        {/* Quick regional stats indicators */}
        <div className="flex gap-2.5 bg-slate-800/60 p-2 rounded-2xl border border-slate-700 w-full md:w-auto overflow-x-auto">
          <div className="text-center px-4 border-r border-slate-700 shrink-0 min-w-[7rem]">
            <span className="text-[9px] block text-slate-400 font-mono">ORGANIZACIONES</span>
            <span className="text-base font-black text-amber-400">{totalOrgs}</span>
          </div>
          <div className="text-center px-4 shrink-0 min-w-[7rem]">
            <span className="text-[9px] block text-slate-400 font-mono">PRIORIDAD ALTA</span>
            <span className="text-base font-black text-rose-400">{highPriorityOrgs}</span>
          </div>
        </div>
      </div>

      {/* ACTION QUICK BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
        <div className="text-left">
          <h3 className="font-sans font-black text-xs uppercase text-slate-850">
            Herramientas Operativas de Programación
          </h3>
          <p className="text-[11px] font-medium text-slate-400">
            Formaliza e inscribe nuevas instituciones en el padrón provincial.
          </p>
        </div>
        
        <button
          onClick={() => setShowOrgForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4 shrink-0" /> Registrar Organización
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
            placeholder="Buscar por Nombre o Dirección..."
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

        {/* Priority Filter Selector */}
        <div className="sm:col-span-3 select-wrapper">
          <select
            value={filterPriority}
            onChange={(e) => {
              setFilterPriority(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-808 text-slate-800 focus:border-indigo-500 focus:outline-hidden"
          >
            <option value="todos">⚠️ Toda Prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

      </div>

      {/* Pagination metrics bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-100 pb-2">
        <span>Mostrando {displayedOrgs.length} de {filteredOrgs.length} organizaciones encontradas</span>
        <div className="flex items-center gap-2">
          <span>Ver:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setPageSize(size);
              setVisibleCount(size === -1 ? filteredOrgs.length : size);
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
      {displayedOrgs.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center text-slate-450 text-slate-400 text-xs">
          Ninguna organización registrada coincide con las combinaciones de filtrado seleccionadas.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedOrgs.map((org) => {
            const isSelected = selectedOrgId === org.id;
            return (
              <div
                key={org.id}
                onClick={() => setSelectedOrgId(org.id)}
                className={`relative bg-white border rounded-2xl p-4.5 flex flex-col justify-between transition-all text-left cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-600 shadow-md bg-indigo-50/10' 
                    : 'border-slate-200 hover:border-slate-350'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2.5 mb-2">
                    <div className="min-w-0">
                      <span className="text-[9px] font-mono text-slate-400 block mb-0.5">ID: {org.id}</span>
                      <h4 className="font-sans font-black text-xs text-slate-900 uppercase tracking-tight truncate leading-tight">
                        {org.nombre}
                      </h4>
                      <p className="text-[10.5px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {org.direccion}
                      </p>
                    </div>

                    <span className={`text-[8px] px-2 py-0.5 rounded-md uppercase tracking-wider font-mono font-black shrink-0 ${
                      org.nivel_prioridad === 'alta' 
                        ? 'bg-rose-50 border border-rose-200 text-rose-800' 
                        : org.nivel_prioridad === 'media'
                        ? 'bg-amber-50 border border-amber-200 text-amber-800'
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-800'
                    }`}>
                      {org.nivel_prioridad}
                    </span>
                  </div>

                  {/* Info and weaknesses */}
                  <div className="mt-3 space-y-1 bg-slate-50 border border-slate-150/80 p-2.5 rounded-xl text-[10px]">
                    <p className="text-slate-655 text-slate-600 font-medium">
                      🎯 Público: <strong>{org.sector_demografico}</strong>
                    </p>
                    <p className="text-slate-655 text-slate-600 leading-normal font-medium">
                      📍 Distrito: <strong>{org.distrito || 'No especificado'}</strong>
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                      {org.deficiencias_infraestructura.map((def, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 text-slate-700 py-0.5 px-2 rounded-md font-bold inline-flex items-center gap-1 text-[9px]"
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
                        handleOpenEdit(org);
                      }}
                      className="p-1 px-1.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg hover:border-slate-400 transition-all cursor-pointer"
                      title="Editar Organización"
                    >
                      <Edit className="w-3.5 h-3.5" />
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

      {/* Button to load more */}
      {pageSize !== -1 && filteredOrgs.length > visibleCount && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + pageSize, filteredOrgs.length))}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Ver más Organizaciones (+{Math.min(pageSize, filteredOrgs.length - visibleCount)})
          </button>
        </div>
      )}

      {/* MODAL LIGHT OVERLAY FOR WIZARD FORM: ORGANIZATION */}
      {showOrgForm && (
        <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
          <div className="py-8 max-w-2xl w-full">
            <OrganizationForm 
              onRegister={(org) => {
                addOrganization(org);
              }}
              onClose={() => setShowOrgForm(false)}
            />
          </div>
        </div>
      )}

      {/* EDIT MODAL DIALOG (GLASS TRANSLUCENT) */}
      <AnimatePresence>
        {editingOrg && (
          <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-3xl max-w-lg w-full relative border border-white/10 shadow-2xl text-slate-800"
            >
              <button
                onClick={() => setEditingOrg(null)}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-indigo-650" />
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Editar Organización: {editingOrg.nombre}
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
                    Nombre de la Organización
                  </label>
                  <input
                    type="text"
                    required
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Dirección exacta
                  </label>
                  <input
                    type="text"
                    required
                    value={editDireccion}
                    onChange={(e) => setEditDireccion(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Distrito
                    </label>
                    <select
                      value={editDistrito}
                      onChange={(e) => setEditDistrito(e.target.value as PiuraDistrict)}
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

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Prioridad
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as PriorityLevel)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-hidden"
                    >
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Población Atiende
                  </label>
                  <input
                    type="text"
                    value={editSector}
                    onChange={(e) => setEditSector(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Deficiencias / Necesidades (Separadas por comas)
                  </label>
                  <textarea
                    rows={2}
                    value={editDeficiencias}
                    onChange={(e) => setEditDeficiencias(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingOrg(null)}
                    className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors cursor-pointer"
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
