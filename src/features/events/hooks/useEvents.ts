/**
 * @file useEvents.ts
 * @description Hook de gestión de estado para la feature de Eventos Sociales.
 * Encapsula todo el estado y los handlers relacionados con eventos y bolsas.
 */
import { useState } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { SocialEvent, BolsaItem } from '../types/event.types';
import { INITIAL_EVENTS } from '../data/events.seed';
import { SIMULATED_TODAY } from '../../../shared/constants/districts.constants';

export function useEvents() {
  const [events, setEvents] = useLocalStorage<SocialEvent[]>('stare_events', INITIAL_EVENTS);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    () => INITIAL_EVENTS[0]?.id || null
  );

  /** Agrega un nuevo evento social al listado. */
  const addEvent = (newEvent: SocialEvent) => {
    setEvents(prev => [...prev, newEvent]);
    setSelectedEventId(newEvent.id);
  };

  /** Marca un evento como completado (usado por el voluntario móvil). */
  const completeEvent = (eventId: string) => {
    setEvents(prev =>
      prev.map(evt =>
        evt.id === eventId ? { ...evt, status: 'completado' } : evt
      )
    );
  };

  /**
   * Actualiza la cantidad actual de ítems de una bolsa a partir de donaciones en especie.
   */
  const updateBolsaFromDonation = (
    eventId: string,
    itemsDonated: { itemName: string; qty: number }[]
  ) => {
    if (eventId === 'stock_general') return;
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedItems = evt.itemsBolsa.map(item => {
          const match = itemsDonated.find(ap => ap.itemName === item.name);
          return match ? { ...item, currentQty: item.currentQty + match.qty } : item;
        });
        return { ...evt, itemsBolsa: updatedItems };
      })
    );
  };

  /**
   * Balancea el inventario de una bolsa usando el fondo de adquisición.
   * @returns Resultado con monto gastado y mensaje descriptivo.
   */
  const balanceInventory = (
    eventId: string,
    maxBudget: number,
    availableFund: number
  ): { success: boolean; spent: number; msg: string } => {
    const targetEvent = events.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, spent: 0, msg: 'Hito no encontrado' };
    if (maxBudget > availableFund) return { success: false, spent: 0, msg: 'Presupuesto excede el Fondo de Adquisición' };

    let remaining = maxBudget;
    let spent = 0;
    const trace: string[] = [];

    const updatedEvents = events.map(evt => {
      if (evt.id !== eventId) return evt;
      const updatedItems = evt.itemsBolsa.map((item: BolsaItem) => {
        const deficit = Math.max(0, item.targetQty - item.currentQty);
        if (deficit <= 0) return item;
        const maxAffordable = Math.floor(remaining / item.unitPriceEstimate);
        const buyQty = Math.min(deficit, maxAffordable);
        if (buyQty > 0) {
          const cost = buyQty * item.unitPriceEstimate;
          remaining -= cost;
          spent += cost;
          trace.push(`${buyQty} ${item.unit} de ${item.name}`);
          return { ...item, currentQty: item.currentQty + buyQty };
        }
        return item;
      });
      return { ...evt, itemsBolsa: updatedItems };
    });

    if (spent === 0) {
      return { success: false, spent: 0, msg: 'El monto ingresado es menor que el valor de una sola unidad de los insumos restantes.' };
    }

    setEvents(updatedEvents);
    return {
      success: true,
      spent,
      msg: `Se han destinado S/. ${spent.toFixed(2)} del Fondo de Adquisición para balancear el inventario.`,
    };
  };

  /**
   * Compra directa de un ítem específico de una bolsa.
   */
  const directBuyItem = (
    eventId: string,
    itemId: string,
    qtyToBuy: number
  ) => {
    setEvents(prev =>
      prev.map(evt => {
        if (evt.id !== eventId) return evt;
        const updatedItems = evt.itemsBolsa.map(item =>
          item.id === itemId
            ? { ...item, currentQty: item.currentQty + qtyToBuy }
            : item
        );
        return { ...evt, itemsBolsa: updatedItems };
      })
    );
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
    // Métricas
    pendingEventsCount,
    overallCoveragePct,
    SIMULATED_TODAY,
  };
}
