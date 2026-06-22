# 🛠️ DEVELOPER GUIDE — STARE Piura

> **Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social**
> Stack: React 19 · TypeScript 5.8 · TailwindCSS 4 · Vite 6 · Motion · Lucide React
> Arquitectura: Feature-Folder / Module-Based

---

## Tabla de Contenidos

1. [Configuración del Entorno](#1-configuración-del-entorno)
2. [Cómo Crear una Nueva Feature (paso a paso)](#2-cómo-crear-una-nueva-feature-paso-a-paso)
3. [Cómo Crear Componentes](#3-cómo-crear-componentes)
4. [Cómo Crear Hooks](#4-cómo-crear-hooks)
5. [Cómo Crear Servicios](#5-cómo-crear-servicios)
6. [Cómo Crear Tipos](#6-cómo-crear-tipos)
7. [Cómo Agregar Pantallas / Navegación](#7-cómo-agregar-pantallas--navegación)
8. [Cómo Conectar APIs y Persistencia](#8-cómo-conectar-apis-y-persistencia)
9. [Cómo Reutilizar Componentes de Shared](#9-cómo-reutilizar-componentes-de-shared)
10. [Cómo Realizar Pruebas](#10-cómo-realizar-pruebas)
11. [Checklist antes de Commit](#11-checklist-antes-de-commit)

---

## 1. Configuración del Entorno

### Requisitos previos

- Node.js >= 20.x
- npm >= 10.x

### Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd stare-piura

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Variables de entorno

Copiar `.env.example` a `.env` y ajustar según el entorno:

```bash
cp .env.example .env
```

### Estructura raíz del proyecto

```
stare-piura/
├── src/
│   ├── app/                    # Configuración global: router, layouts, providers, config
│   │   ├── config/             # app.config.ts — ActiveScreen, APP_CONFIG
│   │   ├── layouts/            # AppLayout.tsx — shell visual principal
│   │   ├── providers/          # Providers de contexto (si aplica)
│   │   └── router/             # AppRouter.tsx — enrutador basado en estado
│   ├── features/               # Módulos de dominio (feature-based)
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── donations/
│   │   ├── finance/
│   │   ├── mypes/
│   │   ├── organizations/
│   │   └── volunteer/
│   ├── shared/                 # Utilidades y contratos reutilizables entre features
│   │   ├── assets/
│   │   ├── components/         # Componentes UI genéricos (Button, Modal, etc.)
│   │   ├── constants/          # Constantes globales (distritos, fechas, etc.)
│   │   ├── hooks/              # Hooks reutilizables (useLocalStorage)
│   │   ├── services/           # Servicios transversales (storageService)
│   │   ├── types/              # Tipos compartidos entre features (PiuraDistrict)
│   │   └── utils/              # Funciones de utilidad puras
│   ├── components/             # Componentes legacy (migrar gradualmente a features/)
│   ├── App.tsx                 # Entry point del árbol React
│   ├── main.tsx                # Mount point de ReactDOM
│   └── index.css               # Estilos globales + directivas Tailwind
├── docs/                       # Documentación técnica
├── assets/                     # Assets estáticos (imágenes, fuentes)
├── index.html
├── vite.config.ts
└── tsconfig.json
```

---

## 2. Cómo Crear una Nueva Feature (paso a paso)

Ejemplo: Crear la feature **`reports`** (Reportes y Exportaciones).

### Paso 1 — Crear la estructura de carpetas

```bash
mkdir -p src/features/reports/components
mkdir -p src/features/reports/hooks
mkdir -p src/features/reports/types
mkdir -p src/features/reports/data
```

### Paso 2 — Definir los tipos del dominio

```typescript
// src/features/reports/types/report.types.ts
/**
 * @file report.types.ts
 * @description Tipos del dominio de Reportes y Exportaciones.
 */

export type ReportFormat = 'pdf' | 'csv' | 'json';
export type ReportStatus = 'pendiente' | 'generado' | 'error';

export interface Report {
  id: string;
  title: string;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: string;
  filePath?: string;
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  format?: ReportFormat;
}
```

### Paso 3 — Crear los datos semilla

```typescript
// src/features/reports/data/reports.seed.ts
/**
 * @file reports.seed.ts
 * @description Datos iniciales para la feature de Reportes.
 */
import type { Report } from '../types/report.types';

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-001',
    title: 'Reporte Mensual Junio 2026',
    format: 'pdf',
    status: 'generado',
    createdAt: '2026-06-01',
  },
];
```

### Paso 4 — Crear el hook de estado

```typescript
// src/features/reports/hooks/useReports.ts
/**
 * @file useReports.ts
 * @description Hook de gestión de estado para la feature de Reportes.
 */
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import type { Report, ReportFilters } from '../types/report.types';
import { INITIAL_REPORTS } from '../data/reports.seed';

export function useReports() {
  const [reports, setReports] = useLocalStorage<Report[]>('stare_reports', INITIAL_REPORTS);

  /**
   * Agrega un nuevo reporte al historial.
   * @param report - Datos del reporte sin ID (el ID se genera aquí)
   */
  const addReport = (report: Omit<Report, 'id'>): Report => {
    const newReport: Report = { ...report, id: `rep-${Date.now()}` };
    setReports(prev => [newReport, ...prev]);
    return newReport;
  };

  /**
   * Filtra reportes según criterios opcionales.
   * @param filters - Filtros de fecha y formato
   * @returns Lista de reportes filtrados
   */
  const getFilteredReports = (filters: ReportFilters): Report[] => {
    return reports.filter(rep => {
      if (filters.format && rep.format !== filters.format) return false;
      if (filters.dateFrom && rep.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && rep.createdAt > filters.dateTo) return false;
      return true;
    });
  };

  return {
    reports,
    addReport,
    getFilteredReports,
  };
}
```

### Paso 5 — Crear el componente principal

```tsx
// src/features/reports/components/ReportList.tsx
/**
 * @file ReportList.tsx
 * @description Lista de reportes generados con opciones de exportación.
 */
import { FileText, Download } from 'lucide-react';
import type { Report } from '../types/report.types';

interface ReportListProps {
  reports: Report[];
  onDownload: (reportId: string) => void;
}

export function ReportList({ reports, onDownload }: ReportListProps) {
  if (reports.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic text-center py-8">
        No hay reportes generados aún.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {reports.map(report => (
        <li
          key={report.id}
          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{report.title}</p>
              <p className="text-xs text-slate-400 font-mono">{report.createdAt}</p>
            </div>
          </div>
          <button
            onClick={() => onDownload(report.id)}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### Paso 6 — Crear el barrel (index.ts)

```typescript
// src/features/reports/index.ts
/**
 * @file index.ts — Feature: reports
 * @description Barrel de re-exportación pública de la feature de Reportes.
 * Solo exporta lo que otras features o la app necesitan consumir.
 */
export * from './types/report.types';
export * from './hooks/useReports';
// No exportar: datos seed, componentes internos (consumidos solo localmente)
```

### Paso 7 — Integrar en AppRouter

Ver sección [7. Cómo Agregar Pantallas / Navegación](#7-cómo-agregar-pantallas--navegación).

---

## 3. Cómo Crear Componentes

### Plantilla de componente estándar

```tsx
// src/features/<feature>/components/MyComponent.tsx
/**
 * @file MyComponent.tsx
 * @description Descripción del componente y su propósito en la feature.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import { SomeIcon } from 'lucide-react';
import type { SomeType } from '../types/feature.types';

// 1. Definir Props con interface nombrada
interface MyComponentProps {
  /** Elemento principal a mostrar */
  item: SomeType;
  /** Callback al seleccionar el elemento */
  onSelect?: (id: string) => void;
  /** Modo compacto para vistas móviles */
  compact?: boolean;
}

// 2. Función nombrada con PascalCase
export function MyComponent({ item, onSelect, compact = false }: MyComponentProps) {
  // 3. Estado local (si es necesario)
  const [isExpanded, setIsExpanded] = useState(false);

  // 4. Handlers locales
  const handleClick = () => {
    onSelect?.(item.id);
    setIsExpanded(prev => !prev);
  };

  // 5. Render condicional temprano (guard clause)
  if (!item) return null;

  // 6. JSX limpio con clases Tailwind semánticas
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all"
    >
      <button
        onClick={handleClick}
        className="flex items-center gap-2 w-full text-left"
      >
        <SomeIcon className="w-5 h-5 text-teal-600 shrink-0" />
        <span className={`font-semibold text-slate-900 ${compact ? 'text-sm' : 'text-base'}`}>
          {item.title}
        </span>
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600">
          {item.description}
        </div>
      )}
    </motion.div>
  );
}
```

### Reglas para componentes

| Regla | Descripción |
|---|---|
| Máx ~200 líneas | Si supera ese límite, extraer sub-componentes |
| Props tipadas | Siempre con `interface NombreProps` |
| Sin lógica de negocio | La lógica va en el hook; el componente solo renderiza |
| `export` nombrado | Nunca `export default`, siempre `export function` |
| Guard clauses | `if (!data) return null` al inicio del componente |

---

## 4. Cómo Crear Hooks

Los hooks encapsulan toda la lógica de estado de una feature. Un hook por feature como regla general.

### Plantilla de hook estándar

```typescript
// src/features/<feature>/hooks/useFeature.ts
/**
 * @file useFeature.ts
 * @description Hook de gestión de estado para la feature de [Nombre].
 * Encapsula estado, handlers y métricas derivadas del dominio.
 */
import { useState } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import type { FeatureEntity } from '../types/feature.types';
import { INITIAL_DATA } from '../data/feature.seed';

export function useFeature() {
  // 1. Estado persistido
  const [items, setItems] = useLocalStorage<FeatureEntity[]>('stare_items', INITIAL_DATA);

  // 2. Estado local (NO persistido)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. Acciones (handlers de estado)
  /**
   * Agrega un nuevo ítem al listado.
   * @param item - Datos del ítem sin ID generado
   */
  const addItem = (item: Omit<FeatureEntity, 'id'>): FeatureEntity => {
    const newItem: FeatureEntity = { ...item, id: `item-${Date.now()}` };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  };

  /**
   * Elimina un ítem por su ID.
   * @param itemId - ID del ítem a eliminar
   */
  const removeItem = (itemId: string): void => {
    setItems(prev => prev.filter(i => i.id !== itemId));
  };

  // 4. Métricas derivadas (computed values)
  const totalCount = items.length;
  const activeItems = items.filter(i => i.status === 'activo');

  // 5. Retornar objeto nombrado con todo lo público
  return {
    items,
    selectedId,
    setSelectedId,
    addItem,
    removeItem,
    // Métricas
    totalCount,
    activeItems,
  };
}
```

### Reglas para hooks

| Regla | Descripción |
|---|---|
| Prefijo `use` | Siempre: `useEvents`, `useDonations`, `useFinance` |
| Retorno como objeto | `return { ... }` nunca como array (salvo pattern useState) |
| Clave `stare_` en localStorage | Prefijo obligatorio para claves de persistencia |
| Separar estado local vs persistido | `useState` para UI temporal, `useLocalStorage` para datos de negocio |
| JSDoc en funciones públicas | Documentar parámetros y retorno |

---

## 5. Cómo Crear Servicios

Los servicios son objetos de utilidad que encapsulan operaciones de infraestructura (I/O, APIs externas, etc.). No tienen estado de React.

### Plantilla de servicio

```typescript
// src/shared/services/export.service.ts
/**
 * @file export.service.ts
 * @description Servicio para exportación de datos en distintos formatos.
 * Centraliza la lógica de serialización separada de los componentes.
 */

export const exportService = {
  /**
   * Exporta un array de objetos como archivo CSV.
   * @param data - Array de objetos a exportar
   * @param filename - Nombre del archivo (sin extensión)
   */
  toCsv<T extends Record<string, unknown>>(data: T[], filename: string): void {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row =>
      Object.values(row).map(v => `"${String(v)}"`).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  },

  /**
   * Exporta datos como archivo JSON.
   * @param data - Datos a serializar
   * @param filename - Nombre del archivo (sin extensión)
   */
  toJson(data: unknown, filename: string): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },
};
```

### Uso del servicio

```typescript
import { exportService } from '../../shared/services/export.service';

// En un handler de componente o hook:
const handleExportDonations = () => {
  exportService.toCsv(donations, 'donaciones_junio_2026');
};
```

---

## 6. Cómo Crear Tipos

### Ubicación de tipos

| Tipo | Ubicación |
|---|---|
| Tipos de dominio de una feature | `src/features/<feature>/types/<feature>.types.ts` |
| Tipos compartidos entre features | `src/shared/types/` |
| Tipos de configuración de la app | `src/app/config/app.config.ts` |

### Plantilla de archivo de tipos

```typescript
// src/features/reports/types/report.types.ts
/**
 * @file report.types.ts
 * @description Tipos del dominio de Reportes.
 */

// Unions de string (siempre con "type")
export type ReportFormat = 'pdf' | 'csv' | 'json';
export type ReportStatus = 'pendiente' | 'generado' | 'error';

// Entidad principal del dominio (interface para objetos)
export interface Report {
  id: string;
  title: string;
  format: ReportFormat;
  status: ReportStatus;
  createdAt: string;
  filePath?: string;        // Opcional con "?"
}

// Props de componentes (siempre sufijo "Props")
export interface ReportListProps {
  reports: Report[];
  onDownload: (reportId: string) => void;
}

// Tipos derivados con Omit / Pick
export type CreateReportInput = Omit<Report, 'id' | 'status'>;
export type ReportSummary = Pick<Report, 'id' | 'title' | 'status'>;
```

---

## 7. Cómo Agregar Pantallas / Navegación

La navegación de STARE Piura es **offline-first basada en estado** (no react-router). El tipo `ActiveScreen` controla qué pantalla se muestra.

### Paso 1 — Agregar la nueva pantalla al tipo `ActiveScreen`

```typescript
// src/app/config/app.config.ts

export type ActiveScreen =
  | 'dashboard'
  | 'captacion'
  | 'balance'
  | 'voluntario'
  | 'organizaciones'
  | 'reportes';        // ← Agregar aquí la nueva pantalla
```

### Paso 2 — Agregar la entrada en el menú de navegación

```typescript
// src/app/layouts/AppLayout.tsx (o donde esté definido el nav)

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'captacion', label: 'Captación', icon: HandHeart },
  { id: 'balance', label: 'Balance', icon: Scale },
  { id: 'voluntario', label: 'Voluntario', icon: Users },
  { id: 'organizaciones', label: 'Organizaciones', icon: Building2 },
  { id: 'reportes', label: 'Reportes', icon: FileBarChart },  // ← Nueva entrada
] as const;
```

### Paso 3 — Renderizar la nueva pantalla en `AppRouter.tsx`

```tsx
// src/app/router/AppRouter.tsx

// 1. Importar el hook y componentes de la nueva feature
import { useReports } from '../../features/reports';
import { ReportList } from '../../features/reports/components/ReportList';

// 2. Dentro de AppRouter(), inicializar el hook
const { reports, addReport, getFilteredReports } = useReports();

// 3. Agregar el bloque de renderizado condicional
{activeScreen === 'reportes' && (
  <motion.section
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
      <h2 className="text-sm font-mono font-black text-slate-900 uppercase tracking-widest">
        Reportes y Exportaciones
      </h2>
    </div>
    <ReportList
      reports={reports}
      onDownload={(id) => console.log('Descargar:', id)}
    />
  </motion.section>
)}
```

---

## 8. Cómo Conectar APIs y Persistencia

### 8.1 Persistencia Offline (patrón actual)

STARE Piura usa `localStorage` como fuente de verdad. El patrón es:

```
useLocalStorage<T>(key, initialValue)
    ↓
storageService.get<T>(key) / storageService.set<T>(key, value)
    ↓
localStorage
```

```typescript
// Uso en cualquier hook de feature
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';

const [items, setItems] = useLocalStorage<Item[]>('stare_items', INITIAL_ITEMS);
// "items" se sincroniza automáticamente con localStorage en cada cambio
```

### 8.2 Conectar una API REST (patrón futuro)

Si en el futuro se conecta a un backend, el patrón recomendado es:

```typescript
// src/shared/services/api.service.ts
/**
 * @file api.service.ts
 * @description Cliente HTTP base para conexión con el backend de STARE.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const apiService = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${endpoint}`);
    return response.json() as Promise<T>;
  },

  async post<TBody, TResponse>(endpoint: string, body: TBody): Promise<TResponse> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${endpoint}`);
    return response.json() as Promise<TResponse>;
  },
};
```

```typescript
// Uso en un hook con API
import { useState, useEffect } from 'react';
import { apiService } from '../../../shared/services/api.service';
import type { Report } from '../types/report.types';

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await apiService.get<Report[]>('/api/reports');
        setReports(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return { reports, loading, error };
}
```

---

## 9. Cómo Reutilizar Componentes de Shared

### Componentes disponibles en `shared/components/`

> Antes de crear un nuevo componente UI genérico (botones, badges, modales, etc.), revisa si ya existe en `src/shared/components/`.

```typescript
// Importación desde shared
import { Badge } from '../../shared/components/Badge';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { EmptyState } from '../../shared/components/EmptyState';
```

### Hooks disponibles en `shared/hooks/`

```typescript
// Hook de persistencia genérico
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

const [config, setConfig] = useLocalStorage<AppConfig>('stare_config', DEFAULT_CONFIG);
```

### Constantes disponibles en `shared/constants/`

```typescript
// Constantes de distritos de Piura
import { PIURA_DISTRICTS, SIMULATED_TODAY } from '../../shared/constants/districts.constants';

// En un formulario:
<select>
  {PIURA_DISTRICTS.map(district => (
    <option key={district} value={district}>{district}</option>
  ))}
</select>
```

### Tipos compartidos en `shared/types/`

```typescript
import type { PiuraDistrict } from '../../shared/types';

interface FormState {
  district: PiuraDistrict;    // Tipado con el tipo compartido
  amount: number;
}
```

---

## 10. Cómo Realizar Pruebas

### 10.1 Pruebas de hooks (recomendado con Vitest + React Testing Library)

```typescript
// src/features/donations/hooks/useDonations.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDonations } from './useDonations';

// Mock de localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useDonations', () => {
  beforeEach(() => localStorageMock.clear());

  it('debe iniciar con las donaciones semilla', () => {
    const { result } = renderHook(() => useDonations());
    expect(result.current.donations.length).toBeGreaterThan(0);
  });

  it('debe agregar una nueva donación', () => {
    const { result } = renderHook(() => useDonations());
    const initialLength = result.current.donations.length;

    act(() => {
      result.current.addDonation({
        id: 'test-001',
        mypeName: 'La Granjita',
        mypeCategory: 'Alimentos',
        district: 'Piura',
        date: '2026-06-22',
        method: 'Yape_Plin',
        amount: 50,
        eventId: 'ev-001',
      });
    });

    expect(result.current.donations.length).toBe(initialLength + 1);
    expect(result.current.donations[0].mypeName).toBe('La Granjita');
  });

  it('getDonationMetrics debe calcular correctamente', () => {
    const { result } = renderHook(() => useDonations());
    const { counts, amounts } = result.current.getDonationMetrics();

    expect(typeof counts).toBe('object');
    expect(typeof amounts).toBe('object');
  });
});
```

### 10.2 Pruebas de componentes

```tsx
// src/features/reports/components/ReportList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportList } from './ReportList';
import type { Report } from '../types/report.types';

const mockReports: Report[] = [
  { id: 'rep-001', title: 'Reporte Junio', format: 'pdf', status: 'generado', createdAt: '2026-06-01' },
];

describe('ReportList', () => {
  it('debe renderizar la lista de reportes', () => {
    render(<ReportList reports={mockReports} onDownload={jest.fn()} />);
    expect(screen.getByText('Reporte Junio')).toBeInTheDocument();
  });

  it('debe llamar onDownload al hacer clic en Descargar', () => {
    const onDownload = jest.fn();
    render(<ReportList reports={mockReports} onDownload={onDownload} />);

    fireEvent.click(screen.getByText('Descargar'));
    expect(onDownload).toHaveBeenCalledWith('rep-001');
  });

  it('debe mostrar estado vacío cuando no hay reportes', () => {
    render(<ReportList reports={[]} onDownload={jest.fn()} />);
    expect(screen.getByText(/No hay reportes/i)).toBeInTheDocument();
  });
});
```

### 10.3 Correr pruebas

```bash
# Ejecutar todas las pruebas
npm run test

# Modo watch (recarga automática)
npm run test:watch

# Con cobertura
npm run test:coverage
```

---

## 11. Checklist antes de Commit

### Código
- [ ] El código compila sin errores TypeScript (`npm run build` o `tsc --noEmit`)
- [ ] Sin `console.log` de debug activos
- [ ] Sin `any` explícito en tipos
- [ ] Hooks en `useLocalStorage` usan clave con prefijo `stare_`

### Estructura
- [ ] Archivos en la carpeta correcta según su tipo
- [ ] Nuevo código exportado en el `index.ts` de su feature (si es API pública)
- [ ] Importaciones entre features pasan por el barrel `index.ts`

### Calidad
- [ ] Componentes con sus Props tipadas en interface
- [ ] Lógica de negocio extraída a hooks (no en JSX)
- [ ] Keys de listas con IDs de dominio (no índices)
- [ ] Animaciones de Motion con variantes consistentes

### Documentación
- [ ] Nuevos archivos con encabezado `@file` y `@description`
- [ ] Funciones públicas con JSDoc básico
- [ ] `CODING_GUIDELINES.md` no requiere actualización por cambios introducidos

### Pruebas (si aplica)
- [ ] Pruebas unitarias para la nueva lógica de negocio
- [ ] Pruebas de renderizado para componentes con lógica condicional

---

*Última actualización: Junio 2026 — Mantenido por el equipo de desarrollo de STARE Piura*
