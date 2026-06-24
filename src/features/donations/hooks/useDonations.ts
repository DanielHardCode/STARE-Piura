import { useDonationStore, useMypeStore, useEventStore, useFinanceStore } from '@/stores';
import { MicroDonation, DonationMethod } from '../types/donation.types';
import { PiuraDistrict } from '../../../shared/types';
import { FundSourceType } from '../../finance/types/finance.types';

export function useDonations() {
  const {
    donations: storeDonations,
    addDonation: storeAddDonation,
    addDonor: storeAddDonor,
    fetchDonations,
    fetchDonors
  } = useDonationStore();

  // Adapter Pattern: Mapear donaciones de Zustand al tipo MicroDonation de UI
  const donations: MicroDonation[] = storeDonations.map((don) => ({
    id: don.id,
    mypeName: don.donor_nombre,
    mypeCategory: 'General',
    district: 'Piura Centro', // Default representativo
    date: don.fecha.split('T')[0],
    method: (don.medio_pago === 'yape'
      ? 'Yape'
      : don.medio_pago === 'plin'
      ? 'Plin'
      : don.medio_pago === 'transferencia'
      ? 'Transferencia'
      : don.medio_pago === 'especie'
      ? 'Especie'
      : 'Efectivo_CajaChica') as DonationMethod,
    amount: don.monto,
    itemsDonated: don.items?.map((item) => ({
      itemName: item.item_nombre,
      qty: item.cantidad,
    })),
    eventId: don.event_id || 'stock_general',
    phone: '',
    ruc: '',
    txNumber: '',
    receiptFileName: don.comprobante_url || '',
    comment: don.descripcion || '',
  }));

  /** Registra una nueva microdonación y actualiza inventario y finanzas si aplica. */
  const addDonation = async (
    eventId: string,
    mypeName: string,
    category: string,
    district: PiuraDistrict,
    method: DonationMethod,
    amount?: number,
    itemsDonated?: { itemName: string; qty: number }[],
    additionalData?: {
      ruc?: string;
      phone?: string;
      expiryDate?: string;
      itemCategory?: string;
      fundDestination?: FundSourceType;
      txNumber?: string;
      receiptFileName?: string;
    }
  ) => {
    // 1. Buscar o crear donante
    const donors = useDonationStore.getState().donors;
    let donor = donors.find((d) => d.nombres.toLowerCase() === mypeName.toLowerCase());

    if (!donor) {
      const mypesList = useMypeStore.getState().mypes;
      const mype = mypesList.find((m) => m.razon_social.toLowerCase() === mypeName.toLowerCase() || m.ruc === additionalData?.ruc);
      donor = await storeAddDonor({
        nombres: mypeName,
        tipo: additionalData?.ruc && additionalData.ruc.length === 11 ? 'empresa' : 'persona_natural',
        documento: additionalData?.ruc || '00000000',
        telefono: additionalData?.phone,
        email: undefined,
        distrito: district,
        mype_id: mype?.id,
      });
    }

    // 2. Mapear medio de pago
    const mappedMethod = (method as any) === 'Yape'
      ? 'yape'
      : (method as any) === 'Plin'
      ? 'plin'
      : (method as any) === 'Transferencia'
      ? 'transferencia'
      : (method as any) === 'Especie'
      ? 'especie'
      : 'efectivo';

    // 3. Registrar donación
    const eventUuid = eventId && eventId !== 'stock_general' ? eventId : undefined;
    const newDon = await storeAddDonation({
      donor_id: donor.id,
      donor_nombre: donor.nombres,
      tipo: method === 'Especie' ? 'especie' : 'monetaria',
      medio_pago: mappedMethod as any,
      monto: amount,
      items: itemsDonated?.map((item) => ({
        item_nombre: item.itemName,
        cantidad: item.qty,
        unidad: 'unidades',
      })),
      descripcion: method === 'Especie'
        ? `Aporte en especie de ${category}. Insumos: ${itemsDonated?.map(i => `${i.qty}u de ${i.itemName}`).join(', ') || 'Varios'}.`
        : `Aporte financiero de ${category}.`,
      fondo_destino: method === 'Especie'
        ? undefined
        : additionalData?.fundDestination === 'caja_chica'
        ? 'caja_chica'
        : 'fondo_adquisicion',
      event_id: eventUuid,
      comprobante_url: additionalData?.receiptFileName,
      fecha: new Date().toISOString().split('T')[0],
    });

    // 4. Si es en especie y está asignada a un evento, inyectar stock al hito
    if (method === 'Especie' && itemsDonated && itemsDonated.length > 0 && eventUuid) {
      const targetEvt = useEventStore.getState().events.find(e => e.id === eventUuid);
      if (targetEvt) {
        for (const item of itemsDonated) {
          const matchingSupplyItem = targetEvt.supply_items.find(s => s.nombre === item.itemName);
          if (matchingSupplyItem) {
            await useEventStore.getState().updateSupplyItem(matchingSupplyItem.id, {
              cantidad_cubierta: matchingSupplyItem.cantidad_cubierta + item.qty,
            });
          }
        }
      }
    }

    // Refrescar balances y transacciones financieras después de registrar
    await Promise.all([
      useFinanceStore.getState().fetchBalances(),
      useFinanceStore.getState().fetchTransactions(),
      useFinanceStore.getState().fetchKPIs(),
      useEventStore.getState().fetchEvents(),
    ]);

    return newDon;
  };

  /** Métricas derivadas: conteo y monto total por nombre de MYPE. */
  const getDonationMetrics = () => {
    const counts: Record<string, number> = {};
    const amounts: Record<string, number> = {};
    storeDonations.forEach(d => {
      counts[d.donor_nombre] = (counts[d.donor_nombre] || 0) + 1;
      if (d.tipo === 'monetaria' && d.monto && d.monto > 0) {
        amounts[d.donor_nombre] = (amounts[d.donor_nombre] || 0) + d.monto;
      }
    });
    return { counts, amounts };
  };

  return {
    donations,
    addDonation,
    getDonationMetrics,
    fetchDonations,
    fetchDonors
  };
}
