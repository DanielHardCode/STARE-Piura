/**
 * @file useMypes.ts
 * @description Hook de gestión del directorio de MYPEs locales.
 */
import { useState } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { MypeProfile } from '../types/mype.types';
import { INITIAL_MYPES } from '../data/mypes.seed';

export function useMypes() {
  const [mypes, setMypes] = useLocalStorage<MypeProfile[]>('stare_mypes', INITIAL_MYPES);
  const [selectedMypeToDonate, setSelectedMypeToDonate] = useState<MypeProfile | null>(null);

  /** Registra una nueva MYPE en el directorio. */
  const registerMype = (newMype: MypeProfile) => {
    setMypes(prev => [newMype, ...prev]);
  };

  /** Selecciona una MYPE para pre-llenar el formulario de captación. */
  const selectMypeForDonation = (mype: MypeProfile) => {
    setSelectedMypeToDonate(mype);
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
