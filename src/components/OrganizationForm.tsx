import React, { useState } from 'react';
import { Organization } from '../types/organization';
import { 
  Building2, 
  MapPin, 
  UserCheck, 
  Info, 
  CheckCircle,
  AlertTriangle, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  Smile,
  Shield,
  HelpCircle
} from 'lucide-react';

interface OrganizationFormProps {
  onRegister: (org: Omit<Organization, 'id'>) => void;
  onClose: () => void;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  text: string;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ onRegister, onClose }) => {
  const [step, setStep] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // STEP 1: Datos Generales
  const [nombre, setNombre] = useState('');
  const [siglas, setSiglas] = useState('');
  const [tipoOrg, setTipoOrg] = useState('Comedor popular');
  const [customTipoOrg, setCustomTipoOrg] = useState('');
  const [estado, setEstado] = useState('Activo');

  // STEP 2: Ubicación
  const [pais, setPais] = useState('Perú');
  const [region, setRegion] = useState('Piura');
  const [provincia, setProvincia] = useState('Piura');
  const [distrito, setDistrito] = useState('');
  const [direccion, setDireccion] = useState('');

  // STEP 3: Persona encargada
  const [encargadoNombre, setEncargadoNombre] = useState('');
  const [encargadoDni, setEncargadoDni] = useState('');
  const [encargadoCelular, setEncargadoCelular] = useState('');
  const [encargadoEmail, setEncargadoEmail] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');

  // STEP 4: Descripción y necesidades
  const [mision, setMision] = useState('');
  const [poblacionAtiende, setPoblacionAtiende] = useState('');
  const [tipoPoblacion, setTipoPoblacion] = useState('Población general');
  const [numBeneficiarios, setNumBeneficiarios] = useState<string>('');
  const [principalesNecesidades, setPrincipalesNecesidades] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Helper: Toast Trigger
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    const newToast = { id: `toast-${Date.now()}`, type, text };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  // Validators
  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      if (!nombre.trim()) {
        triggerToast('Ingrese el nombre de la organización beneficiaria', 'warning');
        return false;
      }
      if (tipoOrg === 'Otro' && !customTipoOrg.trim()) {
        triggerToast('Por favor especifique el tipo de organización', 'warning');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!pais.trim() || !region.trim() || !provincia.trim() || !distrito.trim()) {
        triggerToast('Por favor complete todos los datos de ubicación', 'warning');
        return false;
      }
      if (!direccion.trim()) {
        triggerToast('Por favor especifique la dirección exacta', 'warning');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!encargadoNombre.trim()) {
        triggerToast('Por favor ingrese el nombre completo de la persona encargada', 'warning');
        return false;
      }
      if (!encargadoDni.trim()) {
        triggerToast('El DNI de la persona encargada es obligatorio', 'warning');
        return false;
      }
      if (encargadoDni.trim().length !== 8) {
        triggerToast('El DNI debe tener exactamente 8 caracteres numéricos', 'warning');
        return false;
      }
      if (!encargadoCelular.trim()) {
        triggerToast('Ingrese el número de celular/WhatsApp de contacto', 'warning');
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
    // Reset Form
    setNombre('');
    setSiglas('');
    setTipoOrg('Comedor popular');
    setCustomTipoOrg('');
    setEstado('Activo');
    setPais('Perú');
    setRegion('Piura');
    setProvincia('Piura');
    setDistrito('');
    setDireccion('');
    setEncargadoNombre('');
    setEncargadoDni('');
    setEncargadoCelular('');
    setEncargadoEmail('');
    setSitioWeb('');
    setMision('');
    setPoblacionAtiende('');
    setTipoPoblacion('Población general');
    setNumBeneficiarios('');
    setPrincipalesNecesidades('');
    setObservaciones('');
    setStep(1);
    
    setShowCancelModal(false);
    onClose();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify all steps
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    if (!mision.trim()) {
      triggerToast('Ingrese la misión/objetivo de la organización beneficiaria', 'warning');
      return;
    }

    // Number validation
    let parsedBeneficiarios = undefined;
    if (numBeneficiarios) {
      const val = parseInt(numBeneficiarios);
      if (isNaN(val) || val < 1) {
        triggerToast('El número de beneficiarios debe ser un número entero mayor o igual a 1', 'warning');
        return;
      }
      parsedBeneficiarios = val;
    }

    // Generate Tag-based deficiencias from "Principales necesidades" or defaults
    let defs: string[] = [];
    if (principalesNecesidades.trim()) {
      defs = principalesNecesidades.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else {
      defs = ['Falta infraestructura', 'Soporte nutricional'];
    }

    // Submit organization
    onRegister({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      sector_demografico: poblacionAtiende.trim() || tipoPoblacion,
      deficiencias_infraestructura: defs,
      distrito: distrito.trim()
    });

    triggerToast('¡Organización guardada con éxito!', 'success');
    
    // Auto close after delay
    setTimeout(() => {
      confirmCancel();
    }, 1000);
  };

  return (
    <div className="relative bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-2xl w-full mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl">
            <Building2 className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-sans font-black text-slate-800 uppercase tracking-tight">
              Registrar Organización Beneficiaria
            </h3>
            <p className="text-[11px] font-medium text-slate-400">
              Formulario de evaluación y diagnóstico regional (Piura)
            </p>
          </div>
        </div>
        
        {/* Close Button "X" */}
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
          <span className={step >= 1 ? 'text-indigo-600' : ''}>1. Generales</span>
          <span className={step >= 2 ? 'text-indigo-600' : ''}>2. Ubicación</span>
          <span className={step >= 3 ? 'text-indigo-600' : ''}>3. Encargado</span>
          <span className={step >= 4 ? 'text-indigo-600' : ''}>4. Necesidades</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
          <div 
            className="h-full bg-indigo-600 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* FORM SECTIONS */}
      <div className="min-h-[290px]">
        {/* STEP 1: Datos Generales */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <Info className="w-4 h-4 shrink-0 text-indigo-600" />
              <p>
                <strong>Paso 1:</strong> Identificador comercial y situación tributaria base para formalizar el canal de asignación social en Piura.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Nombre de la organización *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Comedor Popular 'Las Flores'"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Siglas / Acrónimo
                </label>
                <input
                  type="text"
                  placeholder="Ej. CPFL"
                  value={siglas}
                  onChange={(e) => setSiglas(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Tipo de organización *
                </label>
                <select
                  value={tipoOrg}
                  onChange={(e) => setTipoOrg(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 bg-white font-sans font-bold text-slate-800 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="Comedor popular">Comedor popular</option>
                  <option value="Olla común">Olla común</option>
                  <option value="Asociación de padres">Asociación de padres</option>
                  <option value="Fundación">Fundación</option>
                  <option value="ONG">ONG</option>
                  <option value="Iglesia / Parroquia">Iglesia / Parroquia</option>
                  <option value="Club de adultos mayores">Club de adultos mayores</option>
                  <option value="Otro">Otro (especificar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Estado *
                </label>
                <select
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 bg-white font-sans font-bold text-slate-800 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="En proceso de inscripción">En proceso de inscripción</option>
                </select>
              </div>
            </div>

            {tipoOrg === 'Otro' && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Especificar tipo de organización *
                </label>
                <input
                  type="text"
                  placeholder="Ej. Asociación de artesanos de Catacaos"
                  value={customTipoOrg}
                  onChange={(e) => setCustomTipoOrg(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            )}


          </div>
        )}

        {/* STEP 2: Ubicación */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <MapPin className="w-4 h-4 shrink-0 text-indigo-600" />
              <p>
                <strong>Paso 2:</strong> Datos de geolocalización. El sistema prioriza el mapeo en distritos críticos de <strong>Piura</strong> (Catacaos, Tambogrande, etc.) vulnerables a sequías o fenómenos pluviales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  País *
                </label>
                <input
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Departamento / Región *
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Provincia *
                </label>
                <input
                  type="text"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Distrito *
                </label>
                <select
                  value={distrito}
                  onChange={(e) => setDistrito(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 bg-white font-sans font-bold text-slate-800 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="" disabled>-- Selecciona un distrito de Piura --</option>
                  <option value="Piura Centro">Piura Centro</option>
                  <option value="Catacaos">Catacaos</option>
                  <option value="Castilla">Castilla</option>
                  <option value="Veintiséis de Octubre">Veintiséis de Octubre</option>
                  <option value="Sullana">Sullana</option>
                  <option value="Chulucanas">Chulucanas</option>
                  <option value="Sechura">Sechura</option>
                  <option value="Paita">Paita</option>
                  <option value="Talara">Talara</option>
                  <option value="Tambogrande">Tambogrande</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Dirección exacta *
                </label>
                <input
                  type="text"
                  placeholder="Calle, número, urbanización, referencia"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Persona encargada */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <UserCheck className="w-4 h-4 shrink-0 text-indigo-600" />
              <p>
                <strong>Paso 3:</strong> Representación legal o comunal. Vital para el re-contacto logístico de entrega y coordinación offline en campo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Nombre completo del encargado *
                </label>
                <input
                  type="text"
                  placeholder="Ej. María del Carmen Sánchez"
                  value={encargadoNombre}
                  onChange={(e) => setEncargadoNombre(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  DNI (Documento de Identidad) *
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Ej. 12345678"
                  value={encargadoDni}
                  onChange={(e) => setEncargadoDni(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Celular / WhatsApp *
                </label>
                <input
                  type="text"
                  placeholder="Ej. 987654321"
                  value={encargadoCelular}
                  onChange={(e) => setEncargadoCelular(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Correo electrónico (Opcional)
                </label>
                <input
                  type="email"
                  placeholder="Ej. contacto@comedor.org"
                  value={encargadoEmail}
                  onChange={(e) => setEncargadoEmail(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Sitio web / Facebook (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. www.comedorlasflores.org o página de Facebook"
                value={sitioWeb}
                onChange={(e) => setSitioWeb(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Descripción y necesidades */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-2xl mb-4 text-[11px] leading-relaxed text-slate-600 flex gap-2">
              <Smile className="w-4 h-4 shrink-0 text-indigo-700" />
              <p>
                <strong>Paso 4:</strong> Diagnóstico social. Describe el objetivo de tu labor y enumera las necesidades logísticas de soporte (ej. comida, menaje, obras).
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Misión / Objetivo de la organización *
              </label>
              <textarea
                rows={2}
                placeholder="Describa brevemente la misión o el objetivo principal..."
                value={mision}
                onChange={(e) => setMision(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Tipo de población atendida
                </label>
                <select
                  value={tipoPoblacion}
                  onChange={(e) => setTipoPoblacion(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 bg-white font-sans font-bold text-slate-800 focus:border-slate-900 focus:outline-hidden"
                >
                  <option value="Niños">Niños</option>
                  <option value="Adolescentes">Adolescentes</option>
                  <option value="Adultos mayores">Adultos mayores</option>
                  <option value="Familias en situación de vulnerabilidad">Familias en vulnerabilidad</option>
                  <option value="Comunidad indígena">Comunidad indígena</option>
                  <option value="Personas con discapacidad">Personas con discapacidad</option>
                  <option value="Población general">Población general</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                  Número aproximado de beneficiarios (Ej. 150)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ej. 150"
                  value={numBeneficiarios}
                  onChange={(e) => setNumBeneficiarios(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Población que atiende (Descripción)
              </label>
              <textarea
                rows={1.5}
                placeholder="Ej. Niños de 3 a 12 años del caserío, madres gestantes..."
                value={poblacionAtiende}
                onChange={(e) => setPoblacionAtiende(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Principales Necesidades (Separadas por comas)
              </label>
              <textarea
                rows={1.5}
                placeholder="Alimentos, Cocina industrial, Techo Sombreador, Tanque de Agua..."
                value={principalesNecesidades}
                onChange={(e) => setPrincipalesNecesidades(e.target.value)}
                className="w-full text-xs py-1.5 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1 uppercase tracking-wider">
                Observaciones adicionales
              </label>
              <input
                type="text"
                placeholder="Cualquier información complementaria de relevancia..."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-xl border-2 border-slate-200 focus:border-slate-900 focus:outline-hidden font-sans text-slate-850"
              />
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ACTIONS AND NAVIGATION */}
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
          {step < 4 ? (
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
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md shrink-0"
            >
              <Save className="w-4 h-4" /> Guardar Organización
            </button>
          )}
        </div>
      </div>

      {/* REAL FLOATING TOASTS NOTIFIERS */}
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
              ¿Cancelar el registro?
            </h4>
            <p className="text-[11px] leading-relaxed text-slate-500 mb-5">
              Si sales ahora se perderán todos los datos ingresados en el formulario de inscripción de esta organización.
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
