/**
 * @file src/pages/DesignSystemDemo.tsx
 * @description Página de showcase del design system de STARE Piura.
 * ─── CHECKPOINT DE FASE 0 ───
 * Demuestra todos los componentes base, tokens de diseño y animaciones.
 * Esta página es el entregable de la Fase 0 antes de avanzar a la Fase 1.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus, Search, Download, Trash2, Edit2, CheckCircle2,
  Package, Users, CalendarDays, TrendingUp, Heart, MapPin,
} from 'lucide-react';

import {
  Button,
  Card, CardHeader, CardFooter, StatCard,
  Input, Textarea, Select,
  Badge, StatusBadge, CountBadge,
  Skeleton, SkeletonLine, KPICardSkeleton, CardSkeleton, ListItemSkeleton,
  Avatar, AvatarGroup,
  EmptyState, EmptyCalendarIcon, EmptySearchIcon,
  Dialog, ConfirmDialog,
  ToastProvider, useToast,
} from '@/components/ui';
import { listContainerVariants, listItemVariants, fadeUpVariants } from '@/animations/variants';
import { formatCurrency, formatDate } from '@/lib/utils';

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
  id,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUpVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      className="space-y-4"
    >
      <div className="border-b border-[var(--color-border)] pb-3">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

// ─── Demo Inner (needs useToast) ──────────────────────────────────────────────

function DemoContent() {
  const toast = useToast();

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Form state
  const [inputVal, setInputVal] = useState('');
  const [selectVal, setSelectVal] = useState('');

  // Skeleton toggle
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Sample data
  const sampleAvatars = [
    { name: 'María Huerta' },
    { name: 'Carlos Benites' },
    { name: 'Lucia Torres' },
    { name: 'Roberto Paz' },
    { name: 'Ana Castillo' },
    { name: 'Pedro Llontop' },
  ];

  const mockOrgs = [
    { id: 1, name: 'Comedor Popular "Santa Rosa"', type: 'comedor', district: 'Chulucanas', beneficiarios: 110 },
    { id: 2, name: 'Asilo "Hermanitas Desamparados"', type: 'asilo', district: 'Piura Centro', beneficiarios: 36 },
    { id: 3, name: 'PRONOEI "Corazoncitos de Jesús"', type: 'otro', district: 'Catacaos', beneficiarios: 45 },
  ];

  return (
    <div className="space-y-16 pb-20">

      {/* ── Header ── */}
      <div className="text-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
        >
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
          Fase 0 – Design System · STARE Piura
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-4xl sm:text-5xl font-bold text-[var(--color-text-primary)] leading-tight"
        >
          Design System{' '}
          <span className="text-gradient-brand">STARE Piura</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 text-[var(--color-text-secondary)] text-lg max-w-2xl mx-auto"
        >
          Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social —
          Prefectura Zonal de Piura, Perú.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-sm text-[var(--color-text-tertiary)]"
        >
          {formatDate(new Date())} · {formatCurrency(1480.50)} en fondos demo
        </motion.div>
      </div>

      {/* ── Color Tokens ── */}
      <Section id="colors" title="🎨 Paleta de Colores" description="Tokens semánticos del sistema. Cambian automáticamente entre modo claro y oscuro.">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { name: 'Primary 50',  bg: 'bg-teal-50',  text: 'text-teal-900' },
            { name: 'Primary 200', bg: 'bg-teal-200',  text: 'text-teal-900' },
            { name: 'Primary 500', bg: 'bg-teal-500',  text: 'text-white' },
            { name: 'Primary 600', bg: 'bg-teal-600',  text: 'text-white' },
            { name: 'Primary 800', bg: 'bg-teal-800',  text: 'text-white' },
            { name: 'Accent 500',  bg: 'bg-amber-500', text: 'text-white' },
            { name: 'Success',     bg: 'bg-green-600', text: 'text-white' },
            { name: 'Warning',     bg: 'bg-amber-400', text: 'text-white' },
            { name: 'Error',       bg: 'bg-red-600',   text: 'text-white' },
            { name: 'Info',        bg: 'bg-blue-600',  text: 'text-white' },
            { name: 'Slate 100',   bg: 'bg-slate-100', text: 'text-slate-800' },
            { name: 'Slate 800',   bg: 'bg-slate-800', text: 'text-white' },
          ].map((color) => (
            <div key={color.name} className={`${color.bg} ${color.text} p-3 rounded-[var(--radius-lg)] text-xs font-semibold text-center`}>
              {color.name}
            </div>
          ))}
        </div>
      </Section>

      {/* ── Buttons ── */}
      <Section id="buttons" title="🔘 Botones" description="5 variantes × 3 tamaños con estados loading, disabled y microinteracciones.">
        <div className="space-y-6">
          {/* Variants */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">Variantes</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" leadingIcon={<Plus className="w-4 h-4" />}>Primario</Button>
              <Button variant="secondary" leadingIcon={<Heart className="w-4 h-4" />}>Secundario</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" leadingIcon={<Trash2 className="w-4 h-4" />}>Peligro</Button>
            </div>
          </div>
          {/* Sizes */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">Tamaños</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Pequeño</Button>
              <Button size="md">Mediano</Button>
              <Button size="lg">Grande</Button>
            </div>
          </div>
          {/* States */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">Estados</p>
            <div className="flex flex-wrap gap-3">
              <Button loading>Cargando...</Button>
              <Button disabled>Deshabilitado</Button>
              <Button trailingIcon={<Download className="w-4 h-4" />}>Con trailing icon</Button>
            </div>
          </div>
          {/* Toasts */}
          <div>
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">Disparar Toasts</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onClick={() => toast.success('Donación registrada', 'S/. 250.00 en Fondo de Adquisición')}>✅ Éxito</Button>
              <Button variant="danger" size="sm" onClick={() => toast.error('Error de conexión', 'No se pudo contactar al servidor')}>❌ Error</Button>
              <Button variant="secondary" size="sm" onClick={() => toast.warning('Bolsa incompleta', '3 ítems sin cubrir en Evento #2')}>⚠️ Aviso</Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Sincronizando...', 'Datos actualizados desde el backend')}>ℹ️ Info</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Cards ── */}
      <Section id="cards" title="🃏 Cards" description="4 variantes de card con hover effect spring.">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card variant="default" hoverable>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Default</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Border + shadow-sm</p>
          </Card>
          <Card variant="elevated" hoverable>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Elevated</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Sombra más prominente</p>
          </Card>
          <Card variant="glass" hoverable>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Glass</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Glassmorphism + blur</p>
          </Card>
          <Card variant="bordered" hoverable>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">Bordered</p>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-1">Borde más prominente</p>
          </Card>
        </div>
        {/* Stat Cards */}
        <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide mb-3">Stat Cards (KPIs)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Caja Chica"
            value={formatCurrency(430)}
            subtext="Logística y transporte"
            icon={<Package className="w-5 h-5" />}
            trend={{ value: 12.5, label: 'vs. mes anterior' }}
            accentColor="teal"
          />
          <StatCard
            label="Fondo Adquisición"
            value={formatCurrency(1480)}
            subtext="Compra de insumos"
            icon={<TrendingUp className="w-5 h-5" />}
            trend={{ value: -3.2, label: 'vs. mes anterior' }}
            accentColor="amber"
          />
          <StatCard
            label="Beneficiarios"
            value="291"
            subtext="Atendidos este mes"
            icon={<Users className="w-5 h-5" />}
            trend={{ value: 8, label: 'nuevos este mes' }}
            accentColor="teal"
          />
          <StatCard
            label="Visitas Prog."
            value="4"
            subtext="Próximos 30 días"
            icon={<CalendarDays className="w-5 h-5" />}
            accentColor="amber"
          />
        </div>
        {/* Card with header/footer */}
        <div className="mt-4">
          <Card
            variant="default"
            header={
              <CardHeader>
                <span className="text-sm font-semibold text-[var(--color-text-primary)]">Card con Header y Footer</span>
                <Badge color="teal" size="sm">Nuevo</Badge>
              </CardHeader>
            }
            footer={
              <CardFooter>
                <span className="text-xs text-[var(--color-text-tertiary)]">Última actualización: hace 5 min</span>
                <Button size="sm" variant="ghost">Ver más</Button>
              </CardFooter>
            }
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              Este card tiene slots de header y footer composables, útil para módulos complejos como el Kardex o las Organizaciones.
            </p>
          </Card>
        </div>
      </Section>

      {/* ── Inputs ── */}
      <Section id="inputs" title="📝 Inputs" description="Input, Textarea y Select con soporte completo para React Hook Form.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
          <Input
            label="Nombre del donante"
            placeholder="Ej: Bodega La Capullana"
            helperText="Nombre completo o razón social"
            leadingIcon={<Users className="w-4 h-4" />}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            required
          />
          <Input
            label="RUC / DNI"
            placeholder="10 u 11 dígitos"
            trailingIcon={<Search className="w-4 h-4" />}
          />
          <Input
            label="Con error de validación"
            placeholder="Campo inválido"
            error="Este campo es requerido"
            value=""
          />
          <Input
            label="Deshabilitado"
            placeholder="No editable"
            disabled
            value="Campo deshabilitado"
          />
          <Select
            label="Tipo de donación"
            placeholder="Selecciona un tipo"
            options={[
              { value: 'monetaria', label: 'Monetaria' },
              { value: 'especie', label: 'En Especie' },
            ]}
            value={selectVal}
            onChange={(e) => setSelectVal(e.target.value)}
          />
          <Textarea
            label="Observaciones"
            placeholder="Comentarios adicionales sobre la donación..."
            helperText="Máximo 500 caracteres"
            rows={3}
          />
        </div>
      </Section>

      {/* ── Badges ── */}
      <Section id="badges" title="🏷️ Badges" description="9 colores, 2 tamaños, dot indicator y StatusBadge para eventos.">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge color="teal">Teal</Badge>
            <Badge color="amber">Amber</Badge>
            <Badge color="red">Red</Badge>
            <Badge color="green">Green</Badge>
            <Badge color="blue">Blue</Badge>
            <Badge color="purple">Purple</Badge>
            <Badge color="orange">Orange</Badge>
            <Badge color="pink">Pink</Badge>
            <Badge color="slate">Slate</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge color="teal" dot>En Línea</Badge>
            <Badge color="amber" dot size="sm">Pendiente</Badge>
            <Badge color="red" dot>Urgente</Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">Estado de Evento:</p>
            <StatusBadge status="programada" />
            <StatusBadge status="en_curso" />
            <StatusBadge status="realizada" />
            <StatusBadge status="cancelada" />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wide">Count Badge:</p>
            <CountBadge count={3} />
            <CountBadge count={12} />
            <CountBadge count={150} />
          </div>
        </div>
      </Section>

      {/* ── Avatars ── */}
      <Section id="avatars" title="👤 Avatares" description="Iniciales automáticas con colores deterministas y AvatarGroup.">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Avatar key={size} name="María Huerta" size={size} online />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleAvatars.map((av) => (
              <Avatar key={av.name} name={av.name} size="md" />
            ))}
          </div>
          <AvatarGroup avatars={sampleAvatars} max={4} size="sm" />
        </div>
      </Section>

      {/* ── Skeleton ── */}
      <Section id="skeletons" title="💀 Skeletons" description="Loaders que imitan el layout real. Sin spinners genéricos.">
        <div className="space-y-4">
          <Button size="sm" variant="outline" onClick={() => setShowSkeleton((s) => !s)}>
            {showSkeleton ? 'Ocultar Skeletons' : 'Mostrar Skeletons'}
          </Button>
          {showSkeleton && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
              <CardSkeleton lines={4} />
              <CardSkeleton lines={2} />
              <div className="space-y-2">
                <ListItemSkeleton />
                <ListItemSkeleton />
                <ListItemSkeleton />
              </div>
            </div>
          )}
          {!showSkeleton && (
            <p className="text-sm text-[var(--color-text-tertiary)]">
              Haz clic en el botón para ver los skeleton loaders en acción.
            </p>
          )}
        </div>
      </Section>

      {/* ── Empty States ── */}
      <Section id="empty-states" title="📭 Empty States" description="Estados vacíos diseñados, no improvisados.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="default">
            <EmptyState
              title="Sin donaciones aún"
              description="Registra la primera microdonación del día."
              action={{ label: 'Registrar donación', onClick: () => {} }}
              size="sm"
            />
          </Card>
          <Card variant="default">
            <EmptyState
              icon={<EmptyCalendarIcon />}
              title="Sin visitas programadas"
              description="No hay visitas para los próximos 7 días."
              action={{ label: 'Crear visita', onClick: () => {}, icon: <Plus className="w-4 h-4" /> }}
              size="sm"
            />
          </Card>
          <Card variant="default">
            <EmptyState
              icon={<EmptySearchIcon />}
              title="Sin resultados"
              description="Intenta con otros términos de búsqueda."
              size="sm"
            />
          </Card>
        </div>
      </Section>

      {/* ── Dialogs ── */}
      <Section id="dialogs" title="💬 Dialogs" description="Modal (desktop) y bottom sheet (mobile) con animaciones spring.">
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Abrir Dialog
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Confirm Dialog
          </Button>
        </div>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Registrar Nueva Organización"
          description="Completa los datos de la organización beneficiaria"
          size="md"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => { toast.success('Organización guardada'); setDialogOpen(false); }}>
                Guardar
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input label="Nombre de la organización" placeholder="Ej: Comedor Popular Santa Rosa" required />
            <Select
              label="Tipo"
              options={[
                { value: 'comedor', label: 'Comedor Popular' },
                { value: 'asilo', label: 'Asilo / Hogar de Adulto Mayor' },
                { value: 'albergue', label: 'Albergue' },
                { value: 'vaso_de_leche', label: 'Vaso de Leche' },
                { value: 'otro', label: 'Otro' },
              ]}
              placeholder="Selecciona el tipo"
            />
            <Input label="Distrito" leadingIcon={<MapPin className="w-4 h-4" />} placeholder="Ej: Chulucanas" />
          </div>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => { toast.warning('Registro eliminado'); setConfirmOpen(false); }}
          title="¿Eliminar organización?"
          description="Esta acción no se puede deshacer. Los eventos asociados quedarán sin organización."
          confirmLabel="Sí, eliminar"
          variant="danger"
        />
      </Section>

      {/* ── Stagger List Animation ── */}
      <Section id="animations" title="✨ Animaciones – Stagger List" description="Efecto stagger en listas con spring Apple-like.">
        <motion.div
          variants={listContainerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {mockOrgs.map((org) => (
            <motion.div
              key={org.id}
              variants={listItemVariants}
              className="flex items-center gap-4 p-4 bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-[var(--radius-xl)] hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <Avatar name={org.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate">{org.name}</p>
                <p className="text-xs text-[var(--color-text-tertiary)] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {org.district}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-teal-600">{org.beneficiarios}</p>
                <p className="text-[10px] text-[var(--color-text-tertiary)]">beneficiarios</p>
              </div>
              <Badge color={org.type === 'comedor' ? 'teal' : org.type === 'asilo' ? 'purple' : 'amber'} size="sm">
                {org.type}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── Footer ── */}
      <div className="text-center py-8 border-t border-[var(--color-border)]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">
            Fase 0 completada — Design System listo
          </p>
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)]">
          Todos los componentes base están disponibles en <code className="bg-[var(--color-bg-secondary)] px-1 rounded">@/components/ui</code>
        </p>
      </div>
    </div>
  );
}

// ─── Exported Page ────────────────────────────────────────────────────────────

export function DesignSystemDemo() {
  // ToastProvider ya está montado en App.tsx — no duplicar
  return <DemoContent />;
}
