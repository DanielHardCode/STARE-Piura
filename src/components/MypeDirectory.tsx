import React, { useState, useMemo } from 'react';
import { PiuraDistrict, MypeRubro } from '@/types/index';
import { MypeProfile } from '../features/mypes';
import {
  Building2,
  Store,
  Search,
  Plus,
  User,
  Smartphone,
  FileText,
  MapPin,
  Coins,
  UserCheck,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Edit,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMypes } from '../features/mypes';
import { useDonations } from '../features/donations';
import { useMypeStore } from '@/stores/mypes';

interface MypeDirectoryProps {
  mypes?: MypeProfile[];
  onRegisterMype?: (newMype: MypeProfile) => void;
  onSelectMypeForDonation?: (mype: MypeProfile) => void;
  donationCounts?: Record<string, number>; // Maps mypeName to count of donations
  donationAmounts?: Record<string, number>; // Maps mypeName to total financial sum
}

export const MypeDirectory: React.FC<MypeDirectoryProps> = ({
  mypes: propMypes,
  onRegisterMype: propOnRegisterMype,
  onSelectMypeForDonation: propOnSelectMypeForDonation,
  donationCounts: propDonationCounts,
  donationAmounts: propOnDonationAmounts
}) => {
  const { mypes: hookMypes, registerMype: hookRegisterMype, selectMypeForDonation: hookSelectMypeForDonation } = useMypes();
  const { getDonationMetrics } = useDonations();
  const { counts: hookCounts, amounts: hookAmounts } = useMemo(() => getDonationMetrics(), [getDonationMetrics]);

  const mypes = propMypes || hookMypes;
  const onRegisterMype = propOnRegisterMype || hookRegisterMype;
  const onSelectMypeForDonation = propOnSelectMypeForDonation || hookSelectMypeForDonation;
  const donationCounts = propDonationCounts || hookCounts;
  const donationAmounts = propOnDonationAmounts || hookAmounts;

  // Form State (New Mype)
  const [name, setName] = useState('');
  const [ruc, setRuc] = useState('');
  const [phone, setPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [district, setDistrict] = useState<PiuraDistrict>('Piura Centro');
  const [category, setCategory] = useState<MypeRubro>('Bodega');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('todos');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');

  // Paginación de 10 en 10
  const [pageSize, setPageSize] = useState<number>(10);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Local feedback & validation
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Modal de Edición de Mype
  const [editingMype, setEditingMype] = useState<MypeProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editRuc, setEditRuc] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editContactPerson, setEditContactPerson] = useState('');
  const [editDistrict, setEditDistrict] = useState<PiuraDistrict>('Piura Centro');
  const [editCategory, setEditCategory] = useState<MypeRubro>('Bodega');
  const [editErrorMsg, setEditErrorMsg] = useState<string | null>(null);

  const MYPE_CATEGORIES = [
    { value: 'Bodega', label: 'Bodega de Barrio' },
    { value: 'Panadería', label: 'Panadería / Pastelería' },
    { value: 'Farmacia', label: 'Farmacia Local' },
    { value: 'Juguería', label: 'Juguería o Serv. Alimentario' },
    { value: 'Librería', label: 'Librería / Bazar' },
    { value: 'Transporte', label: 'Asociación de Mototaxis / Fletes' },
    { value: 'Otro', label: 'Otro Comercio Vecinal' }
  ];

  // Open edit modal and load data
  const handleOpenEdit = (mype: MypeProfile) => {
    setEditingMype(mype);
    setEditName(mype.name);
    setEditRuc(mype.ruc || '');
    setEditPhone(mype.phone || '');
    setEditContactPerson(mype.contactPerson || '');
    setEditDistrict(mype.district);
    setEditCategory((mype.category as MypeRubro) || 'Bodega');
    setEditErrorMsg(null);
  };

  // Submit update
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditErrorMsg(null);

    if (!editName.trim()) {
      setEditErrorMsg('La Razón Social es obligatoria.');
      return;
    }

    if (editRuc && editRuc !== 'PJ-SIN-RUC' && (editRuc.length !== 11 || !/^\d+$/.test(editRuc))) {
      setEditErrorMsg('El RUC debe constar de 11 dígitos.');
      return;
    }

    if (editPhone && editPhone !== 'Sin número' && (editPhone.length !== 9 || !editPhone.startsWith('9') || !/^\d+$/.test(editPhone))) {
      setEditErrorMsg('El celular debe iniciar con 9 y tener 9 dígitos.');
      return;
    }

    try {
      await useMypeStore.getState().updateMype(editingMype!.id, {
        razon_social: editName.trim(),
        ruc: editRuc,
        contacto: editContactPerson.trim(),
        telefono: editPhone,
        distrito: editDistrict,
        rubro: editCategory
      });

      setSuccessMsg(`✅ ¡MYPE "${editName.trim()}" actualizada con éxito!`);
      setEditingMype(null);

      // Refrescar datos
      await useMypeStore.getState().fetchMypes();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      setEditErrorMsg(err.message || 'Error al actualizar la MYPE.');
    }
  };

  // Validate and submit new Mype
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('La Razón Social o Nombre Comercial es obligatorio.');
      return;
    }

    if (ruc && (ruc.length !== 11 || !/^\d+$/.test(ruc))) {
      setErrorMsg('El RUC peruano debe constar de exactamente 11 dígitos numéricos.');
      return;
    }

    if (phone && (phone.length !== 9 || !phone.startsWith('9') || !/^\d+$/.test(phone))) {
      setErrorMsg('El Celular de contacto debe iniciar con 9 y tener exactamente 9 dígitos.');
      return;
    }

    // Check duplication (by RUC or exact Name)
    const duplicateRuc = ruc && mypes.some(m => m.ruc && m.ruc === ruc);
    if (duplicateRuc) {
      setErrorMsg(`Ya existe una MYPE registrada con el RUC ${ruc}.`);
      return;
    }

    const duplicateName = mypes.some(m => m.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (duplicateName) {
      setErrorMsg(`Ya existe un comercio registrado bajo la Razón Social "${name}".`);
      return;
    }

    const newMype: MypeProfile = {
      id: `mype-${Date.now()}`,
      name: name.trim(),
      ruc: ruc || 'PJ-SIN-RUC',
      phone: phone || 'Sin número',
      district,
      category,
      contactPerson: contactPerson.trim() || 'No especificado',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    if (onRegisterMype) {
      await onRegisterMype(newMype);
    }
    setSuccessMsg(`✅ ¡MYPE "${name.trim()}" afiliada con éxito en el sistema STARE Piura!`);

    // Clear inputs
    setName('');
    setRuc('');
    setPhone('');
    setContactPerson('');
    setDistrict('Piura Centro');
    setCategory('Bodega');
    setShowAddForm(false);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4500);
  };

  // Filter list
  const filteredMypes = mypes.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.ruc.includes(searchQuery) ||
      (m.contactPerson && m.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDistrict =
      selectedDistrictFilter === 'todos' ||
      m.district === selectedDistrictFilter;

    const matchesCategory =
      selectedCategoryFilter === 'todos' ||
      m.category === selectedCategoryFilter;

    return matchesSearch && matchesDistrict && matchesCategory;
  });

  // Paginación lógica
  const displayedMypes = pageSize === -1
    ? filteredMypes
    : filteredMypes.slice(0, visibleCount);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 lg:p-8 shadow-sm transition-all space-y-6">

      {/* Actionable Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-150 pb-5">
        <div className="flex items-center gap-3">
          <span className="p-3 bg-amber-50 text-slate-900 rounded-2xl border border-slate-200">
            <Building2 className="w-6 h-6 animate-pulse" />
          </span>
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest bg-amber-50/50 px-2 py-0.5 rounded-full border border-amber-200/50">
              DIRECTORIO CORE • MICRO-DONANTES
            </span>
            <h3 className="text-lg font-sans font-black text-slate-800 uppercase tracking-tight mt-0.5">
              Afiliación y Registro de MYPEs
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setErrorMsg(null);
          }}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all shadow-2xs"
        >
          {showAddForm ? 'Ocultar Formulario' : 'Afiliar Nueva MYPE'} <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* FEEDBACK BANNERS */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-2.5 text-emerald-800 text-xs"
          >
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <p>{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORM: REGISTER NEW MYPE DONOR */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4 overflow-hidden"
          >
            <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest block mb-1">
              🏢 Formulario de Registro de Donante Vecinal (MYPE)
            </span>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 text-rose-850 rounded-xl text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Name */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Razón Social / Nombre de Tienda *
                </label>
                <div className="relative">
                  <Store className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Comercial Rey Momo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs py-2 px-3 pl-9 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-none font-sans text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* RUC */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Número de RUC (11 dígitos)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="Ej. 20124578963"
                    value={ruc}
                    onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs py-2 px-3 pl-9 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-none font-mono text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Persona / Representante de Venta
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ej. Sra. Clara Inga"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full text-xs py-2 px-3 pl-9 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-none font-sans text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Celular del Contacto (Yape/Plin)
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="Ej. 913456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs py-2 px-3 pl-9 rounded-xl border border-slate-205 focus:border-indigo-500 focus:outline-none font-sans text-slate-800 bg-white"
                  />
                </div>
              </div>

              {/* Piura District */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Distrito de Operación en Piura
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as PiuraDistrict)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Piura Centro">Piura Centro</option>
                  <option value="Catacaos">Catacaos (Bajo Piura)</option>
                  <option value="Castilla">Castilla</option>
                  <option value="Veintiséis de Octubre">Veintiséis de Octubre</option>
                  <option value="Tambogrande">Tambogrande (Alto Piura)</option>
                  <option value="Chulucanas">Chulucanas</option>
                  <option value="Sechura">Sechura</option>
                  <option value="Paita">Paita</option>
                  <option value="Talara">Talara</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Giro Comercial
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MypeRubro)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
                >
                  {MYPE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-sans font-bold text-slate-600 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs rounded-xl transition-all cursor-pointer shadow-2xs"
              >
                Completar Afiliación Zonal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FILTER & SEARCH PRESET */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">

        {/* Search input */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por Razón Social, RUC o Representante..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(pageSize); // reset visible count
            }}
            className="w-full text-xs py-2.5 px-3 pl-9 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-800"
          />
        </div>

        {/* District Filter Selector */}
        <div className="sm:col-span-3">
          <select
            value={selectedDistrictFilter}
            onChange={(e) => {
              setSelectedDistrictFilter(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
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

        {/* Category Filter Selector */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => {
              setSelectedCategoryFilter(e.target.value);
              setVisibleCount(pageSize);
            }}
            className="w-full text-xs py-2.5 px-3 rounded-xl border border-slate-200 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
          >
            <option value="todos">🏪 Todos los Rubros</option>
            {MYPE_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Paginación selector bar */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-100 pb-2">
        <span>Mostrando {displayedMypes.length} de {filteredMypes.length} MYPEs encontradas</span>
        <div className="flex items-center gap-2">
          <span>Ver:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              setPageSize(size);
              setVisibleCount(size === -1 ? filteredMypes.length : size);
            }}
            className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            <option value={10}>10 en 10</option>
            <option value={20}>20 en 20</option>
            <option value={50}>50 en 50</option>
            <option value={-1}>Todos</option>
          </select>
        </div>
      </div>

      {/* LIST OF REGISTERED MYPES CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedMypes.length === 0 ? (
          <div className="col-span-full py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-sm text-slate-400 font-sans space-y-1">
            <HelpCircle className="w-8 h-8 text-slate-350 mx-auto" />
            <p className="font-bold">No se encontraron MYPEs registradas</p>
            <p className="text-xs">Ajuste los términos de búsqueda o afilie un nuevo comercio local.</p>
          </div>
        ) : (
          displayedMypes.map(m => {
            const qtyDonations = donationCounts[m.name] || 0;
            const totalMoney = donationAmounts[m.name] || 0;

            return (
              <div
                key={m.id}
                className="bg-slate-50 border border-slate-150 rounded-2xl p-4 hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col justify-between space-y-3"
              >

                {/* Header card metrics */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="space-y-1 max-w-[70%] text-left">
                    <span className="bg-indigo-50 text-indigo-700 font-mono font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
                      {m.category}
                    </span>
                    <h4 className="font-sans font-black text-slate-900 text-sm leading-tight uppercase">
                      {m.name}
                    </h4>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[10px] text-slate-400 font-mono">DISTRITO</span>
                    <span className="inline-flex items-center gap-0.5 text-slate-800 font-sans font-bold text-xs bg-white border border-slate-150 px-2 py-0.5 rounded-lg shadow-3xs mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      {m.district}
                    </span>
                  </div>
                </div>

                {/* Core metrics data */}
                <div className="bg-white border border-slate-150/40 rounded-xl p-3 grid grid-cols-2 gap-2 text-center select-none shadow-3xs">
                  <div>
                    <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Aportes</span>
                    <span className="inline-block text-sm font-sans font-black text-slate-800 mt-1">
                      {qtyDonations} vecinales
                    </span>
                  </div>
                  <div className="border-l border-slate-150">
                    <span className="block text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Financiero Zonal</span>
                    <span className="inline-block text-sm font-mono font-black text-emerald-600 mt-1">
                      S/. {totalMoney.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Tech footer details */}
                <div className="text-xs space-y-1 text-slate-500 font-sans text-left">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>RUC:</strong> {m.ruc}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate"><strong>Contacto:</strong> {m.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span><strong>Celular:</strong> {m.phone}</span>
                  </div>
                </div>

                {/* Card Actions (Donate + Edit) */}
                <div className="flex items-stretch gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => onSelectMypeForDonation(m)}
                    className="flex-1 text-center bg-white hover:bg-indigo-600 hover:text-white border border-slate-200/80 hover:border-transparent text-indigo-700 py-2.5 px-3 rounded-xl font-sans font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Coins className="w-4 h-4 shrink-0" />
                    Donar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(m)}
                    title="Editar Comercio MYPE"
                    className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 rounded-xl text-slate-600 transition-colors flex items-center justify-center cursor-pointer shadow-3xs"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Button to load more */}
      {pageSize !== -1 && filteredMypes.length > visibleCount && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setVisibleCount(prev => Math.min(prev + pageSize, filteredMypes.length))}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs uppercase rounded-xl transition-all shadow-sm cursor-pointer"
          >
            Ver más MYPEs (+{Math.min(pageSize, filteredMypes.length - visibleCount)})
          </button>
        </div>
      )}

      {/* EDIT MODAL DIALOG (GLASS TRANSLUCENT) */}
      <AnimatePresence>
        {editingMype && (
          <div className="fixed inset-0 bg-slate-950/60 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl max-w-lg w-full relative border border-slate-100 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white"
            >
              <button
                onClick={() => setEditingMype(null)}
                className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Editar Comercio: {editingMype.name}
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
                  <label className="block text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    Razón Social / Nombre Comercial
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 dark:border-slate-700 focus:border-indigo-500 focus:outline-hidden font-sans text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Número de RUC
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={editRuc}
                      onChange={(e) => setEditRuc(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-205 dark:border-slate-700 focus:border-indigo-500 focus:outline-hidden font-mono text-slate-800 dark:text-white bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                      Celular (Yape/Plin)
                    </label>
                    <input
                      type="text"
                      maxLength={9}
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-sans text-slate-800 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Distrito
                    </label>
                    <select
                      value={editDistrict}
                      onChange={(e) => setEditDistrict(e.target.value as PiuraDistrict)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Piura Centro">Piura Centro</option>
                      <option value="Catacaos">Catacaos (Bajo Piura)</option>
                      <option value="Castilla">Castilla</option>
                      <option value="Veintiséis de Octubre">Veintiséis de Octubre</option>
                      <option value="Tambogrande">Tambogrande (Alto Piura)</option>
                      <option value="Chulucanas">Chulucanas</option>
                      <option value="Sechura">Sechura</option>
                      <option value="Paita">Paita</option>
                      <option value="Talara">Talara</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                      Rubro
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as MypeRubro)}
                      className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-sans text-slate-800 focus:border-indigo-500 focus:outline-none"
                    >
                      {MYPE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-sans font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={editContactPerson}
                    onChange={(e) => setEditContactPerson(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:outline-none font-sans text-slate-800 bg-white"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingMype(null)}
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
