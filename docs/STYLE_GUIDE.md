# Guía de Estilos — STARE Piura

> **Versión:** 1.0.0 | **Última actualización:** 2026-06-22  
> Stack: TailwindCSS 4 · React 19 · Motion · Lucide React

---

## 1. Paleta de Colores

### Colores primarios del sistema

| Nombre | Clase Tailwind | Hex | Uso principal |
|---|---|---|---|
| **Sidebar Background** | `bg-slate-900` | `#0f172a` | Fondo del sidebar de navegación |
| **Sidebar Hover** | `bg-slate-800` | `#1e293b` | Estado hover de ítems de navegación |
| **Sidebar Active** | `bg-amber-400` | `#fbbf24` | Ítem activo del sidebar |
| **Content Background** | `bg-slate-50` | `#f8fafc` | Fondo del área de contenido principal |
| **Card Background** | `bg-white` | `#ffffff` | Fondo de tarjetas y paneles |
| **Text Primary** | `text-slate-800` | `#1e293b` | Texto principal en área de contenido |
| **Text Secondary** | `text-slate-500` | `#64748b` | Texto secundario, etiquetas, subtítulos |
| **Text Muted** | `text-slate-400` | `#94a3b8` | Texto muy secundario, placeholders |
| **Sidebar Text** | `text-slate-300` | `#cbd5e1` | Texto de ítems inactivos del sidebar |
| **Sidebar Active Text** | `text-slate-900` | `#0f172a` | Texto del ítem activo (sobre amber) |

### Colores semánticos

| Nombre | Clase Tailwind | Hex | Uso |
|---|---|---|---|
| **Acento principal** | `amber-400 / amber-500` | `#fbbf24 / #f59e0b` | Botones primarios, KPIs principales, ítem activo |
| **Éxito / Cobertura alta** | `emerald-500 / emerald-600` | `#10b981 / #059669` | Estados positivos, cobertura ≥ 80%, fondos disponibles |
| **Aporte en especie** | `indigo-500 / indigo-600` | `#6366f1 / #4f46e5` | Donaciones en especie, badge "Especie" |
| **Peligro / Déficit crítico** | `red-500 / red-600` | `#ef4444 / #dc2626` | Cobertura < 30%, saldo negativo, alertas críticas |
| **Advertencia** | `yellow-400 / yellow-500` | `#facc15 / #eab308` | Cobertura 30-60%, alertas moderadas |
| **Información** | `blue-500 / blue-600` | `#3b82f6 / #2563eb` | Estados informativos, Yape/Plin |
| **Neutral** | `slate-200 / slate-300` | `#e2e8f0 / #cbd5e1` | Bordes, separadores, fondos de inputs |

### Uso de gradientes

```css
/* Gradiente de fondo del sidebar */
background: linear-gradient(to bottom, theme('colors.slate.900'), theme('colors.slate.950'));

/* Gradiente de cards KPI */
background: linear-gradient(135deg, theme('colors.amber.50'), theme('colors.white'));

/* Badge de porcentaje crítico */
background: linear-gradient(90deg, theme('colors.red.500'), theme('colors.red.600'));
```

---

## 2. Tipografía

### Familias de fuentes

| Familia | Clase Tailwind | Uso |
|---|---|---|
| **Sans (sistema)** | `font-sans` | Texto general, títulos, etiquetas, botones, contenido narrativo |
| **Mono** | `font-mono` | Datos numéricos (montos, porcentajes, IDs), código, kardex |

**Regla:** Cualquier número que represente dinero, cantidad o porcentaje debe usar `font-mono` para alineación visual uniforme.

```tsx
// ✅ Datos numéricos en mono
<span className="font-mono text-2xl font-bold text-amber-500">
  S/ 4,250.00
</span>

// ✅ Texto narrativo en sans
<p className="font-sans text-slate-600">
  Fondo destinado a adquisición de bienes.
</p>
```

### Escala tipográfica

| Uso | Clase Tailwind | Tamaño | Peso |
|---|---|---|---|
| Título de página (H1) | `text-2xl font-bold` | 24px | 700 |
| Título de sección (H2) | `text-xl font-semibold` | 20px | 600 |
| Subtítulo / Card title (H3) | `text-base font-semibold` | 16px | 600 |
| Cuerpo principal | `text-sm` | 14px | 400 |
| Etiqueta / Caption | `text-xs` | 12px | 400 |
| KPI grande | `text-3xl font-bold font-mono` | 30px | 700 |
| Badge | `text-xs font-medium` | 12px | 500 |

---

## 3. Espaciados y Contenedores

### Sistema de espaciado

STARE Piura usa la escala de 4px base de Tailwind. Los espaciados más usados:

| Uso | Clase | px |
|---|---|---|
| Padding de card | `p-4` / `p-6` | 16px / 24px |
| Gap entre cards KPI | `gap-4` / `gap-6` | 16px / 24px |
| Padding horizontal de sidebar | `px-3` | 12px |
| Separación entre ítems sidebar | `space-y-1` | 4px |
| Padding de header de página | `px-6 py-4` | 24px / 16px |
| Margen entre secciones | `mb-6` / `mb-8` | 24px / 32px |
| Padding de botón | `px-4 py-2` | 16px / 8px |
| Padding de input | `px-3 py-2` | 12px / 8px |

### Contenedores de layout

```tsx
// Layout raíz — divide pantalla en sidebar + contenido
<div className="flex h-screen bg-slate-50 overflow-hidden">
  <Sidebar />                              // w-64 fijo
  <main className="flex-1 overflow-y-auto">
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Contenido de la pantalla */}
    </div>
  </main>
</div>

// Grid de KPIs
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Grid de cards
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
```

### Border radius

| Elemento | Clase |
|---|---|
| Cards principales | `rounded-xl` |
| Badges | `rounded-full` |
| Botones | `rounded-lg` |
| Inputs | `rounded-lg` |
| Progress bars | `rounded-full` |
| Modales | `rounded-2xl` |

---

## 4. Componentes de UI Recurrentes

### 4.1 Cards KPI

```tsx
// Card KPI estándar
<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
  <div className="flex items-center justify-between mb-4">
    <div className="p-2 bg-amber-50 rounded-lg">
      <DollarSign className="w-5 h-5 text-amber-500" />
    </div>
    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
      Caja Chica
    </span>
  </div>
  <p className="text-3xl font-bold font-mono text-slate-800">S/ 4,250</p>
  <p className="text-sm text-slate-500 mt-1">Disponible</p>
  <div className="mt-3 flex items-center gap-1">
    <TrendingUp className="w-4 h-4 text-emerald-500" />
    <span className="text-xs text-emerald-600 font-medium">+12% este mes</span>
  </div>
</div>
```

### 4.2 Badges de Estado

```tsx
// Badge de tipo de donación
const badgeVariants = {
  monetaria: 'bg-amber-100 text-amber-700 border-amber-200',
  especie:   'bg-indigo-100 text-indigo-700 border-indigo-200',
  yape:      'bg-blue-100 text-blue-700 border-blue-200',
  plin:      'bg-green-100 text-green-700 border-green-200',
  efectivo:  'bg-emerald-100 text-emerald-700 border-emerald-200',
};

<span className={`
  inline-flex items-center gap-1 px-2 py-0.5
  text-xs font-medium rounded-full border
  ${badgeVariants[tipo]}
`}>
  {etiqueta}
</span>
```

### 4.3 Progress Bars de Cobertura

```tsx
// Barra de cobertura con color semántico
function CoverageBar({ porcentaje }: { porcentaje: number }) {
  const color =
    porcentaje >= 80 ? 'bg-emerald-500' :
    porcentaje >= 50 ? 'bg-amber-400' :
    porcentaje >= 30 ? 'bg-yellow-400' : 'bg-red-500';

  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(100, porcentaje)}%` }}
      />
    </div>
  );
}
```

### 4.4 Botones

```tsx
// Botón primario (acción principal)
<button className="
  bg-amber-400 hover:bg-amber-500
  text-slate-900 font-semibold
  px-4 py-2 rounded-lg
  flex items-center gap-2
  transition-colors duration-200
  shadow-sm hover:shadow-md
  focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
">
  <Plus className="w-4 h-4" />
  Nueva Donación
</button>

// Botón secundario (acción alternativa)
<button className="
  border border-slate-200 hover:border-slate-300
  text-slate-600 hover:text-slate-800
  bg-white hover:bg-slate-50
  px-4 py-2 rounded-lg
  transition-colors duration-200
">
  Cancelar
</button>

// Botón destructivo (eliminar)
<button className="
  text-red-500 hover:text-red-700
  hover:bg-red-50
  px-3 py-1.5 rounded-lg
  transition-colors duration-200
">
  <Trash2 className="w-4 h-4" />
</button>
```

### 4.5 Ítems del Sidebar (activo / inactivo)

```tsx
// Ítem inactivo
<button className="
  w-full flex items-center gap-3
  px-3 py-2.5 rounded-lg
  text-slate-300 hover:text-white
  hover:bg-slate-800
  transition-all duration-200
  text-sm font-medium
">
  <Icon className="w-5 h-5 flex-shrink-0" />
  <span>Nombre del módulo</span>
</button>

// Ítem activo
<button className="
  w-full flex items-center gap-3
  px-3 py-2.5 rounded-lg
  bg-amber-400 text-slate-900
  text-sm font-semibold
  shadow-sm
">
  <Icon className="w-5 h-5 flex-shrink-0" />
  <span>Nombre del módulo</span>
</button>
```

### 4.6 Inputs de Formulario

```tsx
<div className="space-y-1">
  <label className="text-sm font-medium text-slate-700">
    Monto (S/)
  </label>
  <input
    type="number"
    className="
      w-full px-3 py-2
      border border-slate-200
      rounded-lg
      text-slate-800 font-mono
      placeholder:text-slate-400
      focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
      bg-white
      transition-shadow duration-200
    "
    placeholder="0.00"
  />
</div>
```

### 4.7 Tablas (Kardex)

```tsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-slate-100">
        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Fecha
        </th>
        {/* ... */}
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-50">
      <tr className="hover:bg-slate-50 transition-colors duration-150">
        <td className="px-4 py-3 font-mono text-slate-800">22/06/2026</td>
        {/* ... */}
      </tr>
    </tbody>
  </table>
</div>
```

---

## 5. Patrones Responsive

STARE Piura usa **un solo breakpoint crítico**: `md:` (768px).

| Elemento | Mobile (< 768px) | Desktop (≥ 768px) |
|---|---|---|
| Sidebar | Oculto o drawer | Visible fijo, `w-64` |
| Grid KPIs | `grid-cols-1` | `grid-cols-2` → `grid-cols-4` |
| Grid Cards | `grid-cols-1` | `grid-cols-2` → `grid-cols-3` |
| Tabla Kardex | Scroll horizontal | Full width |
| Header de página | Stack vertical | Flex row (título + acciones) |

```tsx
// Header responsive
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  <div>
    <h1 className="text-2xl font-bold text-slate-800">Command-Center</h1>
    <p className="text-slate-500 text-sm mt-0.5">Resumen financiero · Prefectura Zonal de Piura</p>
  </div>
  <button className="...">Nueva Transacción</button>
</div>
```

---

## 6. Accesibilidad

### Contraste de colores (WCAG AA)

| Combinación | Ratio | Cumple AA (4.5:1) |
|---|---|---|
| `text-slate-800` sobre `bg-white` | 12.6:1 | ✅ |
| `text-slate-900` sobre `bg-amber-400` | 9.8:1 | ✅ |
| `text-slate-300` sobre `bg-slate-900` | 7.2:1 | ✅ |
| `text-amber-500` sobre `bg-white` | 3.0:1 | ⚠️ Solo para texto grande |
| `text-emerald-600` sobre `bg-white` | 4.6:1 | ✅ |

### Atributos ARIA requeridos

```tsx
// Botones sin texto visible
<button aria-label="Eliminar donación de Juan Pérez">
  <Trash2 className="w-4 h-4" />
</button>

// Progress bars
<div
  role="progressbar"
  aria-valuenow={porcentaje}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label={`Cobertura de leche: ${porcentaje}%`}
>

// Modales
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Nueva Donación</h2>
</div>

// Navegación del sidebar
<nav aria-label="Módulos del sistema">
```

### Focus visible

Todos los elementos interactivos tienen `focus:ring-2 focus:ring-amber-400 focus:ring-offset-2` para navegación por teclado.

---

## 7. Micro-animaciones con Motion

### Variants reutilizables

```ts
// src/utils/motionVariants.ts

// Fade-in al entrar en pantalla
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

// Stagger para listas de cards
export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.07 },
  },
};

// Escala al aparecer (para KPI cards)
export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

// Slide lateral para sidebar drawer (mobile)
export const slideInLeft = {
  initial: { x: -240, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit:    { x: -240, opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};
```

### Uso en componentes

```tsx
import { motion, AnimatePresence } from 'motion/react';
import { fadeInUp, staggerContainer } from '@/utils/motionVariants';

// Lista de cards con stagger
<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="animate"
  className="grid grid-cols-1 md:grid-cols-4 gap-4"
>
  {kpis.map(kpi => (
    <motion.div key={kpi.id} variants={fadeInUp}>
      <KPICard {...kpi} />
    </motion.div>
  ))}
</motion.div>

// AnimatePresence para modales
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
    >
      <motion.div variants={scaleIn} initial="initial" animate="animate">
        <Modal />
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### Reglas de animación

| Regla | Detalle |
|---|---|
| **Duración corta** | Máximo 350ms para interacciones. Animaciones de entrada: 200-300ms. |
| **Ease-out para entradas** | `easeOut` da sensación de respuesta inmediata. |
| **No animar layout** | Evitar animar `width`, `height` o `top/left`; usar `transform` y `opacity`. |
| **Respetar prefers-reduced-motion** | Usar `useReducedMotion()` de Motion para desactivar en usuarios que lo requieren. |

```tsx
import { useReducedMotion } from 'motion/react';

function AnimatedCard({ children }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 8. Iconografía con Lucide React

### Criterios de selección

| Criterio | Descripción |
|---|---|
| **Coherencia de peso** | Usar siempre el estilo outline (defecto de Lucide), nunca mezclar con filled |
| **Tamaños estándar** | `w-4 h-4` (inline), `w-5 h-5` (botones, nav), `w-6 h-6` (headers), `w-8 h-8` (ilustrativos) |
| **Color heredado** | Los iconos heredan el `color` del texto padre via `currentColor` |
| **Semántica clara** | El icono debe reforzar el texto, no reemplazarlo |

### Iconos usados por módulo

| Módulo | Icono principal | Iconos secundarios |
|---|---|---|
| Dashboard | `LayoutDashboard` | `DollarSign`, `TrendingUp`, `TrendingDown`, `ArrowUpCircle`, `ArrowDownCircle` |
| Cronograma | `Calendar` | `Clock`, `MapPin`, `Users`, `Plus` |
| Bolsas de Evento | `Package` | `ShoppingBag`, `AlertTriangle`, `CheckCircle`, `Percent` |
| Microdonaciones | `HandHeart` | `Coins`, `Gift`, `Smartphone`, `Banknote` |
| Directorio MYPE | `Building2` | `Phone`, `MapPin`, `Star`, `ExternalLink` |
| Organizaciones | `Users` | `Home`, `BookOpen`, `Heart`, `CalendarCheck` |
| Balance / Brechas | `Scale` | `BarChart3`, `PieChart`, `AlertCircle`, `Minus` |

```tsx
// Ejemplo correcto de uso
import { DollarSign, TrendingUp } from 'lucide-react';

<DollarSign className="w-5 h-5 text-amber-500" />
```

---

## 9. Buenas Prácticas de TailwindCSS en el Proyecto

### Organizar clases con orden lógico

```tsx
// Orden recomendado: layout → display → spacing → sizing → typography → colors → effects
<div className="
  relative flex items-center justify-between
  px-6 py-4
  w-full
  text-sm font-medium text-slate-700
  bg-white border border-slate-200
  rounded-xl shadow-sm
  hover:shadow-md transition-shadow duration-200
">
```

### Extraer variantes repetidas

```tsx
// ❌ Repetición de clases
<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
<div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">

// ✅ Constante reutilizable
const CARD_BASE = 'bg-white rounded-xl p-6 shadow-sm border border-slate-100';

<div className={CARD_BASE}>
<div className={CARD_BASE}>
```

### Usar `clsx` o `cn` para clases condicionales

```tsx
import { clsx } from 'clsx';

<button
  className={clsx(
    'px-4 py-2 rounded-lg font-semibold transition-colors',
    isActive
      ? 'bg-amber-400 text-slate-900'
      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
  )}
>
```

### No usar clases de TailwindCSS dinámicas no seguras

```tsx
// ❌ Clase dinámica: Tailwind no puede purgarla
const color = isActive ? 'amber' : 'slate';
<div className={`bg-${color}-400`}>

// ✅ Clase completa en el ternario
<div className={isActive ? 'bg-amber-400' : 'bg-slate-200'}>
```

---

*Documentación generada para STARE Piura v1.0.0 — Prefectura Zonal de Piura, Perú.*
