import { useMypeStore } from '@/stores/mypes';
import { MypeProfile } from '../types/mype.types';

export function useMypes() {
  const {
    mypes: storeMypes,
    selectedMypeToDonate: storeSelected,
    addMype,
    setSelectedMypeToDonate,
  } = useMypeStore();

  // Adapter Pattern: Mapear Mype de Zustand a MypeProfile de UI
  const mypes: MypeProfile[] = storeMypes.map((m) => ({
    id: m.id,
    name: m.razon_social,
    ruc: m.ruc,
    phone: m.telefono,
    district: m.distrito as any,
    category: m.rubro,
    contactPerson: m.contacto,
    registeredAt: m.created_at,
  }));

  const selectedMypeToDonate: MypeProfile | null = storeSelected
    ? {
        id: storeSelected.id,
        name: storeSelected.razon_social,
        ruc: storeSelected.ruc,
        phone: storeSelected.telefono,
        district: storeSelected.distrito as any,
        category: storeSelected.rubro,
        contactPerson: storeSelected.contacto,
        registeredAt: storeSelected.created_at,
      }
    : null;

  /** Registra una nueva MYPE en el directorio. */
  const registerMype = async (newMype: MypeProfile) => {
    await addMype({
      razon_social: newMype.name,
      ruc: newMype.ruc,
      rubro: newMype.category as any,
      contacto: newMype.contactPerson,
      telefono: newMype.phone,
      distrito: newMype.district as any,
    });
  };

  /** Selecciona una MYPE para pre-llenar el formulario de captación. */
  const selectMypeForDonation = (mype: MypeProfile) => {
    const matched = storeMypes.find((m) => m.id === mype.id);
    setSelectedMypeToDonate(matched || null);
  };

  /** Limpia la MYPE seleccionada (tras completar el formulario). */
  const clearSelectedMype = () => {
    setSelectedMypeToDonate(null);
  };

  return {
    mypes,
    selectedMypeToDonate,
    registerMype,
    selectMypeForDonation,
    clearSelectedMype,
  };
}
