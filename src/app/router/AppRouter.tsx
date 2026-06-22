/**
 * @file AppRouter.tsx
 * @description Enrutador principal de STARE Piura.
 * Gestiona la navegación entre pantallas mediante estado local (no se usa react-router
 * porque la aplicación es offline-first y de pantalla única).
 * Renderiza el componente de pantalla activo según la selección del usuario.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { Store, MapPin } from 'lucide-react';
import { ActiveScreen } from '../config/app.config';
import { AppLayout } from '../layouts/AppLayout';

// Feature imports
import { KPICards } from '../../components/KPICards';
import { SocialCalendar } from '../../components/SocialCalendar';
import { BolsaMonitor } from '../../components/BolsaMonitor';
import { CaptacionForm } from '../../components/CaptacionForm';
import { BalanceBrechas } from '../../components/BalanceBrechas';
import { VoluntarioMobil } from '../../components/VoluntarioMobil';
import { MypeDirectory } from '../../components/MypeDirectory';
import { OrganizationManager } from '../../components/OrganizationManager';

// Feature hooks
import { useEvents } from '../../features/events';
import { useFinance } from '../../features/finance';
import { useDonations } from '../../features/donations';
import { useMypes } from '../../features/mypes';

// Types
import { SocialEvent } from '../../features/events';
import { FundSourceType } from '../../features/finance';
import { PiuraDistrict } from '../../shared/types';
import { DonationMethod } from '../../features/donations';
import { MypeProfile } from '../../features/mypes';

export function AppRouter() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Feature hooks
  const {
    events,
    selectedEventId,
    setSelectedEventId,
    addEvent,
    completeEvent,
    updateBolsaFromDonation,
    balanceInventory,
    directBuyItem,
    overallCoveragePct,
  } = useEvents();

  const { movements, balances, addTransaction, deductFromAcquisitionFund } = useFinance();
  const { donations, addDonation, getDonationMetrics } = useDonations();
  const { mypes, selectedMypeToDonate, registerMype, selectMypeForDonation, clearSelectedMype } = useMypes();

  const { counts: donationCounts, amounts: donationAmounts } = getDonationMetrics();

  // ─────────────────────────────────────────────────────────────
  // Handlers compuestos (orquestan múltiples features)
  // ─────────────────────────────────────────────────────────────

  /**
   * Registra una microdonación y propaga efectos a inventario y fondos.
   */
  const handleRegisterDonation = (
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
    const donationId = `don-${Date.now()}`;
    const targetEventId = eventId && eventId !== 'stock_general' ? eventId : 'stock_general';

    addDonation({
      id: donationId,
      mypeName,
      mypeCategory: category,
      district,
      date: '2026-06-03',
      method,
      amount,
      itemsDonated,
      eventId: targetEventId,
      phone: additionalData?.phone,
      ruc: additionalData?.ruc,
      txNumber: additionalData?.txNumber,
      receiptFileName: additionalData?.receiptFileName,
      comment: method === 'Especie'
        ? `Aporte en especie de ${category}. Insumos: ${itemsDonated?.map(i => `${i.qty}u de ${i.itemName}`).join(', ') || 'Varios'}.`
        : `Aporte financiero de ${category}. ${additionalData?.txNumber ? `Código Op Yape/Plin: ${additionalData.txNumber}` : 'Asentado en caja.'}`,
    });

    if (method === 'Especie' && itemsDonated && itemsDonated.length > 0 && targetEventId !== 'stock_general') {
      updateBolsaFromDonation(targetEventId, itemsDonated);
    }

    if (method !== 'Especie' && amount && amount > 0) {
      const targetFund: FundSourceType =
        additionalData?.fundDestination || (method === 'Efectivo_CajaChica' ? 'caja_chica' : 'fondo_adquisicion');
      const linkedEvent = events.find(e => e.id === targetEventId);
      const dest = linkedEvent
        ? `visita [${linkedEvent.title}]`
        : 'Stock General (Amortización Contable de Piura)';
      addTransaction(targetFund, 'ingreso', amount, `Consignación MYPE de "${mypeName}" asignado a ${dest}`, method);
    }
  };

  /**
   * Balancea inventario y registra egreso en kardex.
   */
  const handleBalanceInventory = (eventId: string, maxBudget: number) => {
    const result = balanceInventory(eventId, maxBudget, balances.fondoAdquisicion);
    if (result.success) {
      const targetEvent = events.find(e => e.id === eventId);
      deductFromAcquisitionFund(
        result.spent,
        `Balanceo Bolsa de [${targetEvent?.title || eventId}]: compensación automática.`
      );
    }
    return result;
  };

  /**
   * Compra directa de un ítem y registra egreso en kardex.
   */
  const handleDirectBuyItem = (
    eventId: string,
    itemId: string,
    qtyToBuy: number,
    cost: number,
    itemName: string
  ) => {
    deductFromAcquisitionFund(
      cost,
      `Inyección Compensatoria: Adquisición de ${qtyToBuy}u de "${itemName}" para cerrar brecha.`
    );
    directBuyItem(eventId, itemId, qtyToBuy);
  };

  const handleCompleteEvent = (eventId: string) => completeEvent(eventId);
  const handleAddEvent = (newEvent: SocialEvent) => addEvent(newEvent);
  const handleRegisterMype = (mype: MypeProfile) => registerMype(mype);

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
              <KPICards balances={balances} movements={movements} onAddTransaction={addTransaction} />
            </section>

            <div className="flex flex-col gap-8 w-full items-stretch">
              <section id="calendar-view" className="w-full space-y-3">
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
                  <h2 className="text-sm font-mono font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
                    Cronograma y Visitas Programadas Zonal
                  </h2>
                </div>
                <SocialCalendar events={events} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} onAddEvent={handleAddEvent} />
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
                onSelectMypeForDonation={(mype) => {
                  selectMypeForDonation(mype);
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
