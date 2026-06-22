# 📐 CODING GUIDELINES — STARE Piura

> **Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social**
> Stack: React 19 · TypeScript 5.8 · TailwindCSS 4 · Vite 6 · Motion · Lucide React
> Arquitectura: Feature-Folder / Module-Based

---

## Tabla de Contenidos

1. [Convenciones de Nombrado](#1-convenciones-de-nombrado)
2. [Organización de Imports](#2-organización-de-imports)
3. [Estructura de Archivos por Feature](#3-estructura-de-archivos-por-feature)
4. [Comentarios y JSDoc](#4-comentarios-y-jsdoc)
5. [Patrones de TypeScript Recomendados](#5-patrones-de-typescript-recomendados)
6. [Reglas para TailwindCSS](#6-reglas-para-tailwindcss)
7. [Errores Comunes a Evitar](#7-errores-comunes-a-evitar)
8. [Checklist de Código Limpio](#8-checklist-de-código-limpio)

---

## 1. Convenciones de Nombrado

### 1.1 Archivos

| Tipo de Archivo | Convención | Extensión | Ejemplo |
|---|---|---|---|
| Componente React | PascalCase | `.tsx` | `DonationCard.tsx` |
| Hook personalizado | camelCase con prefijo `use` | `.ts` | `useDonations.ts` |
| Tipos / Interfaces | camelCase del dominio | `.types.ts` | `donation.types.ts` |
| Datos semilla | camelCase del dominio | `.seed.ts` | `donations.seed.ts` |
| Servicio | camelCase con sufijo `.service` | `.ts` | `storage.service.ts` |
| Barrel / Re-export | fijo | `.ts` | `index.ts` |
| Constantes | camelCase del dominio | `.constants.ts` | `districts.constants.ts` |
| Configuración de app | camelCase del dominio | `.config.ts` | `app.config.ts` |
| Utilidades | camelCase del dominio | `.utils.ts` | `format.utils.ts` |

### 1.2 Variables y Funciones

```typescript
// ✅ CORRECTO — camelCase para variables y funciones ordinarias
const donationAmount = 150;
const selectedEventId = 'ev-001';
function calculateTotalAmount(donations: MicroDonation[]): number { ... }

// ❌ INCORRECTO
const DonationAmount = 150;       // No usar PascalCase en variables
const donation_amount = 150;      // No usar snake_case
const DONATION_AMOUNT = 150;      // SCREAMING_SNAKE solo para constantes de módulo
```

### 1.3 Constantes de Módulo

```typescript
// ✅ CORRECTO — SCREAMING_SNAKE_CASE para constantes de nivel módulo (seeds, config fija)
export const INITIAL_EVENTS: SocialEvent[] = [...];
export const INITIAL_DONATIONS: MicroDonation[] = [...];
export const PIURA_DISTRICTS = ['Piura', 'Castilla', 'Catacaos'] as const;
export const SIMULATED_TODAY = '2026-06-03';

// ❌ INCORRECTO
export const initialEvents = [...];    // No camelCase para seeds
export const piuraDistricts = [...];   // No camelCase para constantes de módulo
```

### 1.4 Componentes React

```typescript
// ✅ CORRECTO — PascalCase, función nombrada, extensión .tsx
// Archivo: DonationCard.tsx
export function DonationCard({ donation }: DonationCardProps) {
  return <div>...</div>;
}

// ❌ INCORRECTO
export const donationCard = () => <div>...</div>; // No camelCase
export default function(props: any) { ... }       // No función anónima ni default sin nombre
```

### 1.5 Hooks Personalizados

```typescript
// ✅ CORRECTO — siempre comienzan con "use", retornan objeto nombrado
// Archivo: useDonations.ts
export function useDonations() {
  const [donations, setDonations] = useLocalStorage<MicroDonation[]>('stare_donations', []);

  const addDonation = (donation: MicroDonation) => { ... };

  return { donations, addDonation };  // Objeto nombrado, nunca array (salvo useState-like)
}

// ❌ INCORRECTO
export function getDonations() { ... }   // No lleva prefijo "use"
export function Donations() { ... }      // No es PascalCase
```

### 1.6 Tipos e Interfaces

```typescript
// ✅ CORRECTO — PascalCase. Tipos con sufijo Type cuando hay ambigüedad, interfaces sin sufijo
// Archivo: donation.types.ts
export interface MicroDonation {
  id: string;
  mypeName: string;
  amount?: number;
}

export type DonationMethod = 'Efectivo_CajaChica' | 'Yape_Plin' | 'Especie';
export type FundSourceType = 'caja_chica' | 'fondo_adquisicion';

// Props de componentes: sufijo "Props"
export interface DonationCardProps {
  donation: MicroDonation;
  onSelect?: (id: string) => void;
}

// ❌ INCORRECTO
export interface microDonation { ... }      // No camelCase
export type donation_method = string;       // No snake_case ni tipo genérico string
export interface IDonation { ... }          // No prefijo "I" (patrón C#, no TS moderno)
```

### 1.7 Servicios

```typescript
// ✅ CORRECTO — objeto exportado, camelCase, sufijo .service.ts
// Archivo: storage.service.ts
export const storageService = {
  get<T>(key: string): T | null { ... },
  set<T>(key: string, value: T): void { ... },
};

// ❌ INCORRECTO
export class StorageService { ... }   // No usar clases para servicios en este proyecto
export function storage() { ... }    // No función suelta sin contexto
```

### 1.8 Claves de localStorage

```typescript
// ✅ CORRECTO — prefijo "stare_" + nombre del dominio en snake_case
'stare_events'
'stare_donations'
'stare_balances'
'stare_movements'
'stare_mypes'
'stare_org_management_orgs'
'stare_org_management_events'

// ❌ INCORRECTO
'events'          // Sin prefijo (colisiona con otras apps)
'STARE_EVENTS'    // No SCREAMING_SNAKE en claves de storage
'stareEvents'     // No camelCase en claves de storage
```

---

## 2. Organización de Imports

El orden de imports en todos los archivos debe seguir esta estructura:

```typescript
// 1. React y hooks de React
import { useState, useEffect, useCallback } from 'react';

// 2. Librerías externas (npm)
import { motion, AnimatePresence } from 'motion/react';
import { Store, MapPin, ChevronDown } from 'lucide-react';

// 3. Imports de la App (config, layouts, providers)
import { ActiveScreen } from '../app/config/app.config';
import { AppLayout } from '../app/layouts/AppLayout';

// 4. Imports de Features (hooks, componentes)
import { useEvents } from '../../features/events';
import { useDonations } from '../../features/donations';

// 5. Imports de Shared
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { storageService } from '../../shared/services/storage.service';

// 6. Tipos (siempre al final, agrupar con "import type")
import type { SocialEvent } from '../../features/events';
import type { FundSourceType } from '../../features/finance';
import type { PiuraDistrict } from '../../shared/types';
```

> **Regla**: Separa cada grupo con una línea en blanco. Usa `import type` para importar solo tipos cuando sea posible (mejora tree-shaking).

---

## 3. Estructura de Archivos por Feature

Cada feature sigue la misma estructura interna. Ninguna feature puede importar directamente de los archivos internos de otra feature; siempre usa el barrel `index.ts`.

```
src/features/<nombre-feature>/
├── index.ts                    # Barrel: re-exporta lo que la feature expone públicamente
├── components/                 # Componentes UI específicos de la feature
│   ├── FeatureMainComponent.tsx
│   └── FeatureSubComponent.tsx
├── hooks/                      # Lógica de estado (1 hook principal por feature)
│   └── useFeatureName.ts
├── types/                      # Tipos e interfaces del dominio
│   └── featureName.types.ts
└── data/                       # Seeds y datos iniciales
    └── featureName.seed.ts
```

### Ejemplo: Feature `donations`

```
src/features/donations/
├── index.ts                        # export * from './hooks/useDonations'
│                                   # export * from './types/donation.types'
├── components/
│   └── CaptacionForm.tsx
├── hooks/
│   └── useDonations.ts
├── types/
│   └── donation.types.ts
└── data/
    └── donations.seed.ts
```

### Reglas del Barrel (`index.ts`)

```typescript
// ✅ CORRECTO — Solo exporta lo que otras partes necesitan
// src/features/donations/index.ts
export * from './types/donation.types';
export * from './hooks/useDonations';
// NO exportar implementación interna que no sea pública

// ❌ INCORRECTO — Importar directamente sin pasar por el barrel
import { useDonations } from '../../features/donations/hooks/useDonations'; // PROHIBIDO
// ✅ CORRECTO
import { useDonations } from '../../features/donations'; // CORRECTO
```

---

## 4. Comentarios y JSDoc

### 4.1 Encabezado de Archivo

Todo archivo fuente debe comenzar con un bloque JSDoc:

```typescript
/**
 * @file nombreArchivo.ts
 * @description Descripción concisa del propósito del archivo.
 * Incluye contexto adicional si es necesario (máx 3 líneas).
 */
```

### 4.2 JSDoc para Funciones y Hooks

```typescript
/**
 * Registra una nueva microdonación y actualiza el inventario si aplica.
 *
 * @param eventId - ID del evento al que se asigna la donación
 * @param amount - Monto en Soles (PEN). Requerido si method !== 'Especie'
 * @returns void — los efectos se propagan por estado de React
 *
 * @example
 * handleRegisterDonation('ev-001', 'La Granjita', 'Alimentos', 'Piura', 'Yape_Plin', 50);
 */
const handleRegisterDonation = (eventId: string, ...) => { ... };
```

### 4.3 Comentarios Inline

```typescript
// ✅ CORRECTO — Explica el "por qué", no el "qué"
// Usamos Date.now() como ID en lugar de uuid para evitar dependencias externas
const donationId = `don-${Date.now()}`;

// Sección separadora para bloques lógicos distintos
// ─────────────────────────────────────────────────────────────

// ❌ INCORRECTO — El código ya lo dice, el comentario no aporta valor
// Incrementa el contador
count++;
```

### 4.4 Comentarios TODOs

```typescript
// TODO(nombre): Descripción del trabajo pendiente — [fecha o ticket]
// TODO(jperez): Reemplazar Date.now() por UUID v4 — TICKET-42
// FIXME: El cálculo falla cuando availableFund es 0 y se hace balance
```

---

## 5. Patrones de TypeScript Recomendados

### 5.1 Preferir `type` sobre `interface` para uniones y primitivos

```typescript
// ✅ CORRECTO — "type" para uniones, literales, mapped types
export type DonationMethod = 'Efectivo_CajaChica' | 'Yape_Plin' | 'Especie';
export type FundSourceType = 'caja_chica' | 'fondo_adquisicion';
export type PriorityLevel = 'alta' | 'media' | 'baja';

// ✅ CORRECTO — "interface" para contratos de objetos extensibles
export interface MicroDonation {
  id: string;
  mypeName: string;
  amount?: number;
}
```

### 5.2 Usar `Omit` y `Partial` para derivar tipos

```typescript
// ✅ CORRECTO — No duplicar definiciones de tipos
// Al crear un objeto nuevo, el ID lo genera el servicio:
const addOrganization = (org: Omit<Organization, 'id'>): Organization => {
  const newOrg: Organization = { ...org, id: `org-${Date.now()}` };
  setOrganizations(prev => [newOrg, ...prev]);
  return newOrg;
};

// Para actualizaciones parciales:
const updateEvent = (id: string, changes: Partial<SocialEvent>) => { ... };
```

### 5.3 Generics en hooks y servicios

```typescript
// ✅ CORRECTO — Hook genérico reutilizable
export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  ...
}

// Uso con tipo explícito:
const [events, setEvents] = useLocalStorage<SocialEvent[]>('stare_events', INITIAL_EVENTS);
```

### 5.4 `as const` para datos inmutables

```typescript
// ✅ CORRECTO — "as const" da tipos literales precisos
export const APP_CONFIG = {
  name: 'STARE Piura',
  storageStrategy: 'offline-first',
} as const;

export const PIURA_DISTRICTS = [
  'Piura', 'Castilla', 'Catacaos', 'Tambogrande',
] as const;

// Deriva el tipo del array:
export type PiuraDistrict = typeof PIURA_DISTRICTS[number];
```

### 5.5 Evitar `any`, usar `unknown` o tipos específicos

```typescript
// ❌ INCORRECTO
function parseData(data: any) { return data.value; }

// ✅ CORRECTO — Usar unknown y narrowing, o tipado genérico
function parseData<T>(data: unknown): T {
  return data as T; // Solo cuando tenemos certeza del origen
}

// ✅ CORRECTO — Si el tipo es conocido, tipar directamente
storageService.get<SocialEvent[]>('stare_events');
```

### 5.6 Narrowing y Optional Chaining

```typescript
// ✅ CORRECTO — Optional chaining + nullish coalescing
const title = linkedEvent?.title ?? 'Sin evento';
const amount = donation?.amount?.toFixed(2) ?? '0.00';

// ✅ CORRECTO — Early return para Guards
const handleBalance = (eventId: string) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return; // Guard: salida temprana
  // ... lógica segura a partir de aquí
};
```

---

## 6. Reglas para TailwindCSS

### 6.1 Utility-First, sin CSS custom innecesario

```tsx
// ✅ CORRECTO — Utility-first con Tailwind
<div className="flex items-center gap-2 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
  <span className="text-sm font-mono font-bold text-slate-900">MYPE</span>
</div>

// ❌ INCORRECTO — CSS custom para cosas que Tailwind ya cubre
<div style={{ display: 'flex', gap: '8px' }}>...</div>
```

### 6.2 Orden de clases (BEM mental model)

Agrupar clases en este orden conceptual:

1. **Layout**: `flex`, `grid`, `block`, `hidden`
2. **Posición**: `relative`, `absolute`, `z-10`
3. **Dimensiones**: `w-full`, `h-screen`, `max-w-7xl`
4. **Espaciado**: `p-4`, `px-6`, `m-2`, `gap-3`
5. **Fondo y Borde**: `bg-white`, `border`, `rounded-xl`
6. **Sombra**: `shadow-sm`, `shadow-md`
7. **Tipografía**: `text-sm`, `font-bold`, `text-slate-900`
8. **Interacción / Estado**: `hover:shadow-md`, `transition-all`
9. **Responsivo**: `md:grid-cols-2`, `lg:flex-row`

### 6.3 Extraer clases repetitivas a variables

```tsx
// ✅ CORRECTO — Evita repetición de strings largos
const cardBase = "p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all";
const tagStyle = "text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 py-1 px-2.5 rounded-full";

return (
  <div className={cardBase}>
    <span className={tagStyle}>Activo</span>
  </div>
);
```

### 6.4 Motion/Animaciones con valores consistentes

```tsx
// ✅ CORRECTO — Usar variantes de motion para transiciones estándar
const fadeInUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
};

<motion.section {...fadeInUp} className="space-y-4">
  ...
</motion.section>
```

### 6.5 Semántica de colores del proyecto

| Contexto | Color Tailwind | Uso |
|---|---|---|
| Primario / Fondos | `slate-*` | Fondos, textos base |
| Éxito / Financiero | `emerald-*` | Fondos de dinero, aportes monetarios |
| Especie / Inventario | `indigo-*` | Donaciones en especie |
| Alerta / Eventos | `amber-*` | Eventos programados, alertas |
| Datos / Técnico | `teal-*` | KPIs, métricas técnicas |
| Peligro | `red-*` | Errores, déficit crítico |

---

## 7. Errores Comunes a Evitar

### 7.1 Mutación directa de estado

```diff
- // INCORRECTO — Mutar el array directamente
- const addDonation = (donation: MicroDonation) => {
-   donations.push(donation);
-   setDonations(donations);
- };

+ // CORRECTO — Siempre crear nuevo array con función actualizadora
+ const addDonation = (donation: MicroDonation) => {
+   setDonations(prev => [donation, ...prev]);
+ };
```

### 7.2 Importaciones cruzadas entre features

```diff
- // INCORRECTO — Importar de los internos de otra feature
- import { MicroDonation } from '../../donations/types/donation.types';
- import { useDonations } from '../../donations/hooks/useDonations';

+ // CORRECTO — Siempre a través del barrel público
+ import { MicroDonation, useDonations } from '../../donations';
```

### 7.3 Efectos sin dependencias correctas

```diff
- useEffect(() => {
-   storageService.set(key, state);
- }, []); // Dependencias faltantes!

+ useEffect(() => {
+   storageService.set(key, state);
+ }, [key, state]); // Correcto
```

### 7.4 Props tipadas como `any`

```diff
- function DonationCard({ donation }: { donation: any }) { ... }

+ interface DonationCardProps {
+   donation: MicroDonation;
+   onSelect?: (id: string) => void;
+ }
+ function DonationCard({ donation, onSelect }: DonationCardProps) { ... }
```

### 7.5 Key en listas sin ID único

```diff
- {donations.map((don, idx) => (
-   <DonationCard key={idx} donation={don} />
- ))}

+ {donations.map(don => (
+   <DonationCard key={don.id} donation={don} />
+ ))}
```

### 7.6 Componentes demasiado grandes

```
Regla: Si un componente supera ~200 líneas, debe dividirse.
Señales de alerta:
  - Múltiples useState que podrían estar en un hook
  - Secciones con comentarios separadores que podrían ser componentes
  - Lógica de negocio mezclada con JSX
```

---

## 8. Checklist de Código Limpio

Antes de hacer commit, verifica cada punto:

### Nombrado
- [ ] Archivos en la convención correcta (`PascalCase.tsx`, `camelCase.ts`, `*.types.ts`, `*.seed.ts`)
- [ ] Constantes de módulo en `SCREAMING_SNAKE_CASE`
- [ ] Hooks comienzan con `use`
- [ ] Claves de localStorage con prefijo `stare_`

### Tipos
- [ ] Sin uso de `any` explícito
- [ ] Props de componentes tienen interface propia con sufijo `Props`
- [ ] Uniones de strings usan `type`, no `string` genérico
- [ ] Generics tipados correctamente en hooks y servicios

### Estructura
- [ ] El nuevo código está dentro de su feature correspondiente
- [ ] Las importaciones entre features pasan por el barrel `index.ts`
- [ ] El barrel de la feature exporta lo nuevo si es API pública
- [ ] No hay lógica de negocio en componentes UI (extraer a hook)

### Estilo
- [ ] Clases Tailwind en orden lógico (layout → tipografía → interacción)
- [ ] Sin estilos `inline` que puedan reemplazarse con Tailwind
- [ ] Animaciones de Motion con variantes consistentes

### Documentación
- [ ] Archivo con bloque `@file` y `@description`
- [ ] Funciones/hooks públicos con JSDoc (parámetros + `@returns` + `@example`)
- [ ] Comentarios inline explican el "por qué", no el "qué"

### Calidad
- [ ] Sin console.log de debug (solo `console.warn` en manejo de errores)
- [ ] Keys únicas en listas (usar IDs del dominio, no índices)
- [ ] Efectos con array de dependencias completo y correcto
- [ ] Sin mutación directa de arrays/objetos de estado

---

*Última actualización: Junio 2026 — Mantenido por el equipo de desarrollo de STARE Piura*
