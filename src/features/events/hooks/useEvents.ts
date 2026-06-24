import { useEventStore, useFinanceStore } from '@/stores';
import { SocialEvent, BolsaItem } from '../types/event.types';

export function useEvents() {
  const {
    events: storeEvents,
    selectedEventId,
    setSelectedEventId,
    addEvent: storeAddEvent,
    updateEvent: storeUpdateEvent,
    updateSupplyItem: storeUpdateSupplyItem,
    fetchEvents,
  } = useEventStore();

  const {
    addTransaction: storeAddTransaction,
    fetchBalances,
    fetchTransactions,
    fetchKPIs,
  } = useFinanceStore();

  // Adapter Pattern: Mapear del store al tipo de UI SocialEvent
  const events: SocialEvent[] = storeEvents.map((evt) => ({
    id: evt.id,
    title: evt.title,
    description: evt.description || '',
    date: evt.start_time.split('T')[0],
    district: evt.distrito as any,
    targetAudience: evt.target_audience,
    status: evt.status === 'realizada'
      ? 'completado'
      : evt.status === 'en_curso'
      ? 'en_progreso'
      : evt.status === 'cancelada'
      ? 'cancelado'
      : 'programado',
    itemsBolsa: evt.supply_items.map((item) => ({
      id: item.id,
      name: item.nombre,
      unit: item.unidad,
      targetQty: item.cantidad_requerida,
      currentQty: item.cantidad_cubierta,
      unitPriceEstimate: item.precio_unitario_estimado,
    })),
  }));

  /** Agrega un nuevo evento social al listado. */
  const addEvent = async (newEvent: SocialEvent) => {
    await storeAddEvent({
      title: newEvent.title,
      description: newEvent.description,
      distrito: newEvent.district as any,
      target_audience: newEvent.targetAudience,
      start_time: `${newEvent.date}T09:00:00`,
      end_time: `${newEvent.date}T17:00:00`,
    });
    await fetchEvents();
  };

  /** Marca un evento como completado. */
  const completeEvent = async (eventId: string) => {
    await storeUpdateEvent(eventId, {
      status: 'realizada',
    });
    await fetchEvents();
  };

  /**
   * Actualiza la cantidad actual de ítems de una bolsa a partir de donaciones en especie.
   */
  const updateBolsaFromDonation = async (
    eventId: string,
    itemsDonated: { itemName: string; qty: number }[]
  ) => {
    if (eventId === 'stock_general') return;
    const targetEvt = storeEvents.find(e => e.id === eventId);
    if (!targetEvt) return;

    for (const item of itemsDonated) {
      const matchingSupplyItem = targetEvt.supply_items.find(s => s.nombre === item.itemName);
      if (matchingSupplyItem) {
        await storeUpdateSupplyItem(matchingSupplyItem.id, {
          cantidad_cubierta: matchingSupplyItem.cantidad_cubierta + item.qty,
        });
      }
    }
    await fetchEvents();
  };

  /**
   * Balancea el inventario de una bolsa usando el fondo de adquisición.
   */
  const balanceInventory = async (
    eventId: string,
    maxBudget: number,
    availableFund: number
  ): Promise<{ success: boolean; spent: number; msg: string }> => {
    const targetEvent = storeEvents.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, spent: 0, msg: 'Hito no encontrado' };
    if (maxBudget > availableFund) return { success: false, spent: 0, msg: 'Presupuesto excede el Fondo de Adquisición' };

    let remaining = maxBudget;
    let spent = 0;

    for (const item of targetEvent.supply_items) {
      const deficit = Math.max(0, item.cantidad_requerida - item.cantidad_cubierta);
      if (deficit <= 0) continue;
      const maxAffordable = Math.floor(remaining / item.precio_unitario_estimado);
      const buyQty = Math.min(deficit, maxAffordable);
      if (buyQty > 0) {
        const cost = buyQty * item.precio_unitario_estimado;
        remaining -= cost;
        spent += cost;

        await storeUpdateSupplyItem(item.id, {
          cantidad_cubierta: item.cantidad_cubierta + buyQty,
        });
      }
    }

    if (spent === 0) {
      return { success: false, spent: 0, msg: 'El monto ingresado es menor que el valor de una sola unidad de los insumos restantes.' };
    }

    // Registrar egreso en Kardex
    await storeAddTransaction({
      tipo: 'egreso',
      concepto: `Balanceo Bolsa de [${targetEvent.title}]: compensación automática.`,
      monto: spent,
      fondo: 'fondo_adquisicion',
      fecha: new Date().toISOString().split('T')[0],
    });

    // Refrescar
    await Promise.all([
      fetchBalances(),
      fetchTransactions(),
      fetchKPIs(),
      fetchEvents(),
    ]);

    return {
      success: true,
      spent,
      msg: `Se han destinado S/. ${spent.toFixed(2)} del Fondo de Adquisición para balancear el inventario.`,
    };
  };

  /**
   * Compra directa de un ítem específico de una bolsa.
   */
  const directBuyItem = async (
    eventId: string,
    itemId: string,
    qtyToBuy: number
  ) => {
    const targetEvent = storeEvents.find(e => e.id === eventId);
    const targetItem = targetEvent?.supply_items.find(s => s.id === itemId);

    if (targetItem) {
      const cost = qtyToBuy * targetItem.precio_unitario_estimado;
      // egreso
      await storeAddTransaction({
        tipo: 'egreso',
        concepto: `Inyección Compensatoria: Adquisición de ${qtyToBuy}u de "${targetItem.nombre}" para cerrar brecha.`,
        monto: cost,
        fondo: 'fondo_adquisicion',
        fecha: new Date().toISOString().split('T')[0],
      });

      // stock
      await storeUpdateSupplyItem(itemId, {
        cantidad_cubierta: targetItem.cantidad_cubierta + qtyToBuy,
      });

      await Promise.all([
        fetchBalances(),
        fetchTransactions(),
        fetchKPIs(),
        fetchEvents(),
      ]);
    }
  };

  // Métricas derivadas
  const pendingEventsCount = events.filter(e => e.status === 'programado').length;
  let aggregateTargetVal = 0;
  let aggregateCurrentVal = 0;
  events.forEach(evt => {
    evt.itemsBolsa.forEach(item => {
      aggregateTargetVal += item.targetQty * item.unitPriceEstimate;
      aggregateCurrentVal += item.currentQty * item.unitPriceEstimate;
    });
  });
  const overallCoveragePct = aggregateTargetVal > 0
    ? (aggregateCurrentVal / aggregateTargetVal) * 100
    : 0;

  return {
    events,
    selectedEventId,
    setSelectedEventId,
    addEvent,
    completeEvent,
    updateBolsaFromDonation,
    balanceInventory,
    directBuyItem,
    pendingEventsCount,
    overallCoveragePct,
  };
}
