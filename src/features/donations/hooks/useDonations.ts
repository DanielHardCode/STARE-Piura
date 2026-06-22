/**
 * @file useDonations.ts
 * @description Hook de gestión del estado de microdonaciones de MYPEs.
 */
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { MicroDonation } from '../types/donation.types';
import { INITIAL_DONATIONS } from '../data/donations.seed';

export function useDonations() {
  const [donations, setDonations] = useLocalStorage<MicroDonation[]>('stare_donations', INITIAL_DONATIONS);

  /** Registra una nueva microdonación. */
  const addDonation = (donation: MicroDonation) => {
    setDonations(prev => [donation, ...prev]);
  };

  /** Métricas derivadas: conteo y monto total por nombre de MYPE. */
  const getDonationMetrics = () => {
    const counts: Record<string, number> = {};
    const amounts: Record<string, number> = {};
    donations.forEach(d => {
      counts[d.mypeName] = (counts[d.mypeName] || 0) + 1;
      if (d.amount && d.amount > 0) {
        amounts[d.mypeName] = (amounts[d.mypeName] || 0) + d.amount;
      }
    });
    return { counts, amounts };
  };

  return {
    donations,
    addDonation,
    getDonationMetrics,
  };
}
