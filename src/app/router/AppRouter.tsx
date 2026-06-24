/**
 * @file AppRouter.tsx
 * @description Enrutador principal de STARE Piura.
 * Adaptado para consumir los nuevos almacenes Zustand, servicios y repositorios en la Fase 1,
 * sirviendo como puente para mantener la compatibilidad con los componentes visuales existentes.
 */
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Store, MapPin } from 'lucide-react';
import { ActiveScreen } from '../config/app.config';
import { AppLayout } from '../layouts/AppLayout';

// Feature imports (Components)
import { KPICards } from '../../components/KPICards';
import { SocialCalendar } from '../../components/SocialCalendar';
import { BolsaMonitor } from '../../components/BolsaMonitor';
import { CaptacionForm } from '../../components/CaptacionForm';
import { BalanceBrechas } from '../../components/BalanceBrechas';
import { VoluntarioMobil } from '../../components/VoluntarioMobil';
import { MypeDirectory } from '../../components/MypeDirectory';
import { OrganizationManager } from '../../components/OrganizationManager';

// New Zustand Stores
import {
  useEventStore,
  useFinanceStore,
  useDonationStore,
  useMypeStore,
  useOrganizationStore,
  useNotificationStore
} from '@/stores';

// Types (Keep for compatibility with components)
import { SocialEvent } from '../../features/events';
import { FundSourceType } from '../../features/finance';
import { PiuraDistrict } from '../../shared/types';
import { DonationMethod } from '../../features/donations';
import { MypeProfile } from '../../features/mypes';

export function AppRouter() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedMypeToDonate, setSelectedMypeToDonate] = useState<any | null>(null);

  // 1. Consume Zustand stores
  const {
    events: newEvents,
    selectedEventId,
    setSelectedEventId,
    addEvent: storeAddEvent,
    updateEvent: storeUpdateEvent,
    updateSupplyItem: storeUpdateSupplyItem,
    fetchEvents,
  } = useEventStore();

  const {
    transactions: newTransactions,
    balances: newBalances,
    fetchTransactions,
    fetchBalances,
    fetchKPIs,
  } = useFinanceStore();

  const {
    donations: newDonations,
    fetchDonations,
  } = useDonationStore();

  const {
    mypes: newMypes,
    fetchMypes,
  } = useMypeStore();

  // 2. Fetch data from repositories on mount
  useEffect(() => {
    fetchEvents();
    fetchTransactions();
    fetchBalances();
    fetchKPIs();
    fetchDonations();
    fetchMypes();
    useDonationStore.getState().fetchDonors();
    useNotificationStore.getState().fetchNotifications();
    useOrganizationStore.getState().fetchOrganizations();
  }, [fetchEvents, fetchTransactions, fetchBalances, fetchKPIs, fetchDonations, fetchMypes]);

  // 3. Map new domain models to components' expected types (Adapter Pattern)
  const events: SocialEvent[] = newEvents.map((evt) => ({
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

  const balances = {
    cajaChica: newBalances.caja_chica,
    fondoAdquisicion: newBalances.fondo_adquisicion,
  };

  const movements = newTransactions.map((tx) => ({
    id: tx.id,
    fund: tx.fondo as FundSourceType,
    type: tx.tipo as 'ingreso' | 'egreso',
    amount: tx.monto,
    description: tx.concepto,
    method: tx.donation_id ? 'Transferencia' as const : 'Efectivo_CajaChica' as const,
    date: tx.fecha,
  }));

  const donations = newDonations.map((don) => ({
    id: don.id,
    mypeName: don.donor_nombre,
    mypeCategory: 'General',
    district: 'Piura Centro' as PiuraDistrict, // default representativo
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

  const mypes: MypeProfile[] = newMypes.map((m) => ({
    id: m.id,
    name: m.razon_social,
    ruc: m.ruc,
    phone: m.telefono,
    district: m.distrito as any,
    category: m.rubro,
    contactPerson: m.contacto,
    registeredAt: m.created_at,
    email: m.email || '',
    activo: m.activo,
    historialAportes: m.historial_aportes,
  } as any));

  const getDonationMetrics = () => {
    const counts: Record<string, number> = {};
    const amounts: Record<string, number> = {};
    newDonations.forEach((d) => {
      counts[d.donor_nombre] = (counts[d.donor_nombre] || 0) + 1;
      if (d.tipo === 'monetaria' && d.monto) {
        amounts[d.donor_nombre] = (amounts[d.donor_nombre] || 0) + d.monto;
      }
    });
    return { counts, amounts };
  };

  const { counts: donationCounts, amounts: donationAmounts } = getDonationMetrics();

  // 4. Calculate overall coverage pct
  const aggregateTargetVal = newEvents.reduce((acc, evt) => {
    return acc + evt.supply_items.reduce((sAcc, s) => sAcc + s.cantidad_requerida * s.precio_unitario_estimado, 0);
  }, 0);

  const aggregateCurrentVal = newEvents.reduce((acc, evt) => {
    return acc + evt.supply_items.reduce((sAcc, s) => sAcc + s.cantidad_cubierta * s.precio_unitario_estimado, 0);
  }, 0);

  const overallCoveragePct = aggregateTargetVal > 0 ? (aggregateCurrentVal / aggregateTargetVal) * 100 : 0;

  // ─────────────────────────────────────────────────────────────
  // Handlers compuestos (orquestan múltiples features con Zustand)
  // ─────────────────────────────────────────────────────────────

  const handleRegisterDonation = async (
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
      donor = await useDonationStore.getState().addDonor({
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
    const newDon = await useDonationStore.getState().addDonation({
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
      const targetEvt = newEvents.find(e => e.id === eventUuid);
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

    // Refrescar datos
    await Promise.all([
      fetchBalances(),
      fetchTransactions(),
      fetchKPIs(),
      fetchEvents(),
    ]);
  };

  const handleBalanceInventory = async (eventId: string, maxBudget: number) => {
    const targetEvent = newEvents.find(e => e.id === eventId);
    if (!targetEvent) return { success: false, spent: 0, msg: 'Hito no encontrado' };

    const currentBalances = useFinanceStore.getState().balances;
    if (maxBudget > currentBalances.fondo_adquisicion) {
      return { success: false, spent: 0, msg: 'Presupuesto excede el Fondo de Adquisición' };
    }

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

        await useEventStore.getState().updateSupplyItem(item.id, {
          cantidad_cubierta: item.cantidad_cubierta + buyQty,
        });
      }
    }

    if (spent === 0) {
      return { success: false, spent: 0, msg: 'El monto ingresado es menor que el valor de una sola unidad de los insumos restantes.' };
    }

    // Registrar egreso en Kardex
    await useFinanceStore.getState().addTransaction({
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

  const handleDirectBuyItem = async (
    eventId: string,
    itemId: string,
    qtyToBuy: number,
    cost: number,
    itemName: string
  ) => {
    const targetEvent = newEvents.find(e => e.id === eventId);
    const targetItem = targetEvent?.supply_items.find(s => s.id === itemId);

    if (targetItem) {
      // egreso
      await useFinanceStore.getState().addTransaction({
        tipo: 'egreso',
        concepto: `Inyección Compensatoria: Adquisición de ${qtyToBuy}u de "${itemName}" para cerrar brecha.`,
        monto: cost,
        fondo: 'fondo_adquisicion',
        fecha: new Date().toISOString().split('T')[0],
      });

      // stock
      await useEventStore.getState().updateSupplyItem(itemId, {
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

  const handleCompleteEvent = async (eventId: string) => {
    await storeUpdateEvent(eventId, {
      status: 'realizada',
    });
    await Promise.all([fetchEvents(), fetchKPIs()]);
  };

  const handleAddEvent = async (newEvent: SocialEvent) => {
    await storeAddEvent({
      title: newEvent.title,
      description: newEvent.description,
      distrito: newEvent.district,
      target_audience: newEvent.targetAudience,
      start_time: newEvent.date ? `${newEvent.date}T09:00:00` : new Date().toISOString(),
      end_time: newEvent.date ? `${newEvent.date}T17:00:00` : new Date().toISOString(),
    });
    await Promise.all([fetchEvents(), fetchKPIs()]);
  };

  const handleRegisterMype = async (mype: MypeProfile) => {
    await useMypeStore.getState().addMype({
      razon_social: mype.name,
      ruc: mype.ruc,
      rubro: mype.category as any,
      contacto: mype.contactPerson,
      telefono: mype.phone,
      email: (mype as any).email || '',
      distrito: mype.district as any,
    });
    await fetchMypes();
  };

  const selectMypeForDonation = (mype: any) => setSelectedMypeToDonate(mype);
  const clearSelectedMype = () => setSelectedMypeToDonate(null);

  return (
    <AppLayout
      activeScreen={activeScreen}
      onNavigate={setActiveScreen}
      mobileMenuOpen={mobileMenuOpen}
      onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
      overallCoveragePct={overallCoveragePct}
    >
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">

        {/* DASHBOARD */}
        {activeScreen === 'dashboard' && (
          <>
            <section id="funds-section-wrapper" className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                <h2 className="text-sm font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-teal-500 rounded-full" />
                  Módulo de Fondos y Balance Logístico (Caja Chica & Compas)
                </h2>
                <span className="text-xs font-mono text-slate-500 bg-slate-100 rounded px-2.5 py-1">Soles Peruanos (PEN)</span>
              </div>
              <KPICards
                balances={balances}
                movements={movements}
                onAddTransaction={async (fund, type, amount, description) => {
                  await useFinanceStore.getState().addTransaction({
                    tipo: type as any,
                    concepto: description,
                    monto: amount,
                    fondo: fund as any,
                    fecha: new Date().toISOString().split('T')[0],
                  });
                }}
              />
            </section>

            <div className="flex flex-col gap-8 w-full items-stretch">
              <section id="calendar-view" className="w-full space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h2 className="text-sm font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                    Cronograma y Visitas Programadas Zonal
                  </h2>
                </div>
                <SocialCalendar
                  events={events}
                  selectedEventId={selectedEventId}
                  onSelectEvent={setSelectedEventId}
                  onAddEvent={handleAddEvent}
                />
              </section>

              <section id="bolsa-view" className="w-full space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h2 className="text-sm font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                    Cobertura de las Bolsas de Evento
                  </h2>
                </div>
                <BolsaMonitor
                  events={events}
                  selectedEventId={selectedEventId}
                  onSelectEvent={setSelectedEventId}
                  onRegisterDonation={handleRegisterDonation}
                  onBalanceInventory={handleBalanceInventory}
                  availableAcquisitionFund={balances.fondoAdquisicion}
                />
              </section>
            </div>
          </>
        )}

        {/* CAPTACIÓN */}
        {activeScreen === 'captacion' && (
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 w-full">
            <div id="captacion-wrapper-card" className="w-full">
              <CaptacionForm
                events={events}
                onRegisterDonation={handleRegisterDonation}
                activeEventId={selectedEventId}
                mypes={mypes}
                selectedMypeToDonate={selectedMypeToDonate}
                onClearSelectedMype={clearSelectedMype}
              />
            </div>
            <div className="w-full">
              <MypeDirectory
                mypes={mypes}
                onRegisterMype={handleRegisterMype}
                onSelectMypeForDonation={(mypeItem) => {
                  selectMypeForDonation(mypeItem);
                  document.getElementById('captacion-wrapper-card')?.scrollIntoView({ behavior: 'smooth' });
                }}
                donationCounts={donationCounts}
                donationAmounts={donationAmounts}
              />
            </div>
          </motion.section>
        )}

        {/* BALANCE */}
        {activeScreen === 'balance' && (
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <BalanceBrechas
              events={events}
              balances={balances}
              onDirectBuyItem={handleDirectBuyItem}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
            />
          </motion.section>
        )}

        {/* VOLUNTARIO */}
        {activeScreen === 'voluntario' && (
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <VoluntarioMobil events={events} onCompleteEvent={handleCompleteEvent} />
          </motion.section>
        )}

        {/* ORGANIZACIONES */}
        {activeScreen === 'organizaciones' && (
          <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 text-slate-800">
            <OrganizationManager onSyncGlobalEvent={handleAddEvent} />
          </motion.section>
        )}

        {/* FEED GLOBAL DE DONACIONES */}
        <section id="mypes-log" className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-5">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Store className="w-5 h-5" />
              </span>
              <h4 className="font-sans font-bold text-slate-800 text-base">
                DIRECTORIO DE MICRODONANTES MYPE AFILIADAS (PIURA)
              </h4>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 py-1 px-2.5 rounded-full">
              {donations.length} Micro-aportes registrados
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donations.map((don) => {
              const connectedEvent = events.find(e => e.id === don.eventId);
              return (
                <div key={don.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-between hover:shadow-xs transition-all text-xs font-sans relative overflow-hidden">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{don.mypeName}</span>
                        <div className="flex gap-2 mt-0.5 text-[9px] font-mono text-slate-400">
                          {don.phone && <span title="Celular de contacto">📞 {don.phone}</span>}
                          {don.ruc && <span title="RUC registrado">📋 RUC: {don.ruc}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-sans text-slate-500 bg-white border border-slate-100 py-0.5 px-2.5 rounded-full font-semibold shrink-0 h-fit">
                        {don.mypeCategory}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-slate-600">
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {don.district}</p>
                      {don.method === 'Especie' ? (
                        <div className="bg-indigo-50/50 border border-indigo-100 p-2 rounded-xl mt-2 text-[11px] text-indigo-950">
                          <strong>Aporte Físico:</strong>
                          <ul className="list-disc pl-3.5 mt-0.5 space-y-0.5">
                            {don.itemsDonated?.map((item, idx) => (
                              <li key={idx}>{item.qty} u. de {item.itemName}</li>
                            ))}
                          </ul>
                          {don.receiptFileName && <p className="text-[9px] text-indigo-700 font-mono mt-1">📎 Comprobante: {don.receiptFileName}</p>}
                        </div>
                      ) : (
                        <div className="bg-emerald-50/50 border border-emerald-100 p-2 rounded-xl mt-2 text-[11px] text-emerald-950">
                          <strong>Aporte Monetario:</strong> S/. {don.amount?.toFixed(2)} vía <span className="font-bold">{don.method}</span>
                          {don.txNumber && <p className="text-[9px] text-emerald-700 font-mono mt-1">🔑 Op: #{don.txNumber}</p>}
                          {don.receiptFileName && <p className="text-[9px] text-emerald-700 font-mono mt-0.5">📎 Comprobante: {don.receiptFileName}</p>}
                        </div>
                      )}
                      {don.comment && (
                        <p className="text-[11px] italic text-slate-500 mt-2 bg-white/50 border border-slate-100 p-1.5 rounded-md leading-relaxed">
                          "{don.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-dashed border-slate-200/80 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Canalizado el {don.date}</span>
                    {connectedEvent && (
                      <span className="text-amber-600 font-bold max-w-[180px] truncate" title={connectedEvent.title}>
                        → {connectedEvent.title}
                      </span>
                    )}
                    {don.eventId === 'stock_general' && <span className="text-slate-400 font-bold">📦 Stock General</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </AppLayout>
  );
}
