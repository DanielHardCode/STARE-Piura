# 📡 API.md — Documentación de la API Interna

> **STARE Piura** — Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social
> Esta documentación describe los servicios, hooks y handlers que componen la API interna de la aplicación.

---

## Tabla de Contenidos

1. [storageService](#1-storageservice)
2. [useLocalStorage](#2-uselocalstorage)
3. [useEvents](#3-useevents)
4. [useFinance](#4-usefinance)
5. [useDonations](#5-usedonations)
6. [useMypes](#6-usemypes)
7. [useOrganizationManagement](#7-useorganizationmanagement)
8. [Handlers de AppRouter](#8-handlers-de-approuter)

---

## 1. `storageService`

**Archivo**: [`src/shared/services/storage.service.ts`](../src/shared/services/storage.service.ts)

**Descripción**: Capa de abstracción sobre el `localStorage` nativo. Centraliza el acceso a persistencia local, facilita el testing mediante mock y evita duplicación de lógica de serialización/deserialización JSON.

---

### `storageService.get<T>(key)`

Lee y deserializa un ítem del localStorage.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `key` | `string` | ✅ | Clave del ítem en localStorage |

**Retorno**: `T | null` — El valor deserializado o `null` si no existe o hay error de parseo.

```typescript
// Ejemplo de uso
import { storageService } from '../shared/services/storage.service';
import type { SocialEvent } from '../features/events';

const events = storageService.get<SocialEvent[]>('stare_events');
// → SocialEvent[] | null

if (events !== null) {
  console.log(`${events.length} eventos cargados`);
}
```

---

### `storageService.set<T>(key, value)`

Serializa y persiste un valor en localStorage.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `key` | `string` | ✅ | Clave bajo la que se guardará el valor |
| `value` | `T` | ✅ | Valor a serializar (cualquier tipo serializable en JSON) |

**Retorno**: `void`

> **Nota**: Si la serialización falla (ej: objeto circular o cuota superada), registra un `console.warn` y no lanza excepción.

```typescript
import { storageService } from '../shared/services/storage.service';

// Guardar array de eventos
storageService.set<SocialEvent[]>('stare_events', updatedEvents);

// Guardar balances financieros
storageService.set<FundBalances>('stare_balances', { cajaChica: 500, fondoAdquisicion: 1200 });
```

---

### `storageService.remove(key)`

Elimina un ítem específico del localStorage.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `key` | `string` | ✅ | Clave del ítem a eliminar |

**Retorno**: `void`

```typescript
// Eliminar una clave específica
storageService.remove('stare_events');
```

---

### `storageService.clearAll(prefix?)`

Elimina todos los ítems del localStorage cuya clave comience con el prefijo indicado.

| Parámetro | Tipo | Requerido | Default | Descripción |
|---|---|---|---|---|
| `prefix` | `string` | ❌ | `'stare_'` | Prefijo de las claves a eliminar |

**Retorno**: `void`

> **Advertencia**: Con el prefijo por defecto `'stare_'`, elimina **todos** los datos de la aplicación (eventos, donaciones, finanzas, MYPEs, etc.). Usar con precaución.

```typescript
// Limpiar todos los datos de STARE (reset de la aplicación)
storageService.clearAll();

// Limpiar solo claves con prefijo personalizado
storageService.clearAll('stare_org_');
```

---

## 2. `useLocalStorage`

**Archivo**: [`src/shared/hooks/useLocalStorage.ts`](../src/shared/hooks/useLocalStorage.ts)

**Descripción**: Hook genérico de React que sincroniza un valor de estado con localStorage automáticamente. Utiliza `storageService` como capa de abstracción. Es el único mecanismo de persistencia usado por los hooks de feature.

### Firma

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>]
```

### Parámetros

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `key` | `string` | ✅ | Clave de localStorage. Debe comenzar con `stare_` por convención |
| `initialValue` | `T` | ✅ | Valor por defecto si la clave no existe en localStorage |

### Retorno

| Índice | Tipo | Descripción |
|---|---|---|
| `[0]` | `T` | Valor actual (sincronizado con localStorage) |
| `[1]` | `React.Dispatch<React.SetStateAction<T>>` | Setter (igual que el de `useState`) |

### Comportamiento

- Al montar: lee de `localStorage` si existe; si no, usa `initialValue`.
- Al actualizar: persiste el nuevo valor en `localStorage` vía `useEffect`.
- Los cambios son reactivos: React re-renderiza cuando el valor cambia.

### Ejemplo de uso

```typescript
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import type { SocialEvent } from '../../features/events';
import { INITIAL_EVENTS } from '../../features/events';

// Dentro de un hook o componente funcional:
const [events, setEvents] = useLocalStorage<SocialEvent[]>('stare_events', INITIAL_EVENTS);

// Agregar un elemento:
setEvents(prev => [...prev, newEvent]);

// Reemplazar todo el array:
setEvents(updatedEvents);

// Limpiar:
setEvents([]);
```

---

## 3. `useEvents`

**Archivo**: [`src/features/events/hooks/useEvents.ts`](../src/features/events/hooks/useEvents.ts)

**Descripción**: Hook principal de la feature de Eventos Sociales. Gestiona el listado de eventos (`SocialEvent[]`), la selección activa, las bolsas de insumos por evento, y las operaciones de inventario.

**Clave de persistencia**: `'stare_events'`

### Retorno completo

```typescript
const {
  events,           // SocialEvent[]
  selectedEventId,  // string | null
  setSelectedEventId,
  addEvent,
  completeEvent,
  updateBolsaFromDonation,
  balanceInventory,
  directBuyItem,
  pendingEventsCount,
  overallCoveragePct,
  SIMULATED_TODAY,
} = useEvents();
```

---

### `events`

| Tipo | Descripción |
|---|---|
| `SocialEvent[]` | Lista de todos los eventos sociales registrados, persistida en localStorage |

---

### `selectedEventId`

| Tipo | Descripción |
|---|---|
| `string \| null` | ID del evento actualmente seleccionado en la UI. No persistido. |

---

### `setSelectedEventId(id)`

| Parámetro | Tipo | Descripción |
|---|---|---|
| `id` | `string \| null` | ID del evento a seleccionar, o `null` para deseleccionar |

**Retorno**: `void`

```typescript
setSelectedEventId('ev-001');   // Seleccionar evento
setSelectedEventId(null);       // Deseleccionar
```

---

### `addEvent(newEvent)`

Agrega un nuevo evento social y lo selecciona automáticamente.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `newEvent` | `SocialEvent` | Objeto evento completo (el ID debe ser generado por el llamador) |

**Retorno**: `void`

**Efectos secundarios**: `selectedEventId` se actualiza al ID del nuevo evento.

```typescript
addEvent({
  id: `ev-${Date.now()}`,
  title: 'Visita Comedor Catacaos',
  date: '2026-07-10',
  district: 'Catacaos',
  status: 'programado',
  itemsBolsa: [],
});
```

---

### `completeEvent(eventId)`

Marca un evento como `'completado'`. Usado por el módulo de Voluntario Móvil.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `eventId` | `string` | ID del evento a completar |

**Retorno**: `void`

```typescript
completeEvent('ev-001');
// El evento con id='ev-001' tendrá status='completado'
```

---

### `updateBolsaFromDonation(eventId, itemsDonated)`

Actualiza las cantidades actuales (`currentQty`) de la bolsa de un evento a partir de donaciones en especie.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `eventId` | `string` | ID del evento cuya bolsa se actualiza. Si es `'stock_general'`, la función no hace nada. |
| `itemsDonated` | `{ itemName: string; qty: number }[]` | Lista de ítems donados con cantidades |

**Retorno**: `void`

```typescript
updateBolsaFromDonation('ev-001', [
  { itemName: 'Arroz 5kg', qty: 10 },
  { itemName: 'Aceite 1L', qty: 5 },
]);
```

---

### `balanceInventory(eventId, maxBudget, availableFund)`

Balancea automáticamente el inventario de la bolsa de un evento comprando ítems con déficit hasta agotar el presupuesto indicado.

| Parámetro | Tipo | Descripción |
|---|---|---|
| `eventId` | `string` | ID del evento cuya bolsa se balanceará |
| `maxBudget` | `number` | Presupuesto máximo a gastar (en Soles PEN) |
| `availableFund` | `number` | Saldo disponible en el fondo de adquisición |

**Retorno**: `{ success: boolean; spent: number; msg: string }`

| Campo | Tipo | Descripción |
|---|---|---|
| `success` | `boolean` | `true` si se pudo realizar al menos una compra |
| `spent` | `number` | Monto efectivamente gastado (en PEN) |
| `msg` | `string` | Mensaje descriptivo del resultado |

```typescript
const result = balanceInventory('ev-001', 300, balances.fondoAdquisicion);

if (result.success) {
  console.log(`Gastado: S/. ${result.spent.toFixed(2)}`);
  // Luego deducir del fondo:
  deductFromAcquisitionFund(result.spent, `Balanceo de [${event.title}]`);
} else {
  console.warn(result.msg);
}
```

---

### `directBuyItem(eventId, itemId, qtyToBuy)`

Compra directa de un ítem específico de una bolsa (incrementa `currentQty`).

| Parámetro | Tipo | Descripción |
|---|---|---|
| `eventId` | `string` | ID del evento que contiene el ítem |
| `itemId` | `string` | ID del ítem dentro de la bolsa |
| `qtyToBuy` | `number` | Cantidad a añadir al inventario actual |

**Retorno**: `void`

```typescript
// Comprar 5 unidades del ítem 'item-arroz' del evento 'ev-001'
directBuyItem('ev-001', 'item-arroz', 5);
```

---

### Métricas derivadas

| Propiedad | Tipo | Descripción |
|---|---|---|
| `pendingEventsCount` | `number` | Número de eventos con `status === 'programado'` |
| `overallCoveragePct` | `number` | Porcentaje de cobertura global (0–100) de todas las bolsas |
| `SIMULATED_TODAY` | `string` | Fecha simulada de operación (`'YYYY-MM-DD'`) |

---

## 4. `useFinance`

**Archivo**: [`src/features/finance/hooks/useFinance.ts`](../src/features/finance/hooks/useFinance.ts)

**Descripción**: Hook de gestión del estado financiero. Mantiene el kardex de movimientos (`BalanceMovement[]`) y los saldos actuales de los fondos (`FundBalances`).

**Claves de persistencia**: `'stare_movements'`, `'stare_balances'`

### Retorno completo

```typescript
const {
  movements,                  // BalanceMovement[]
  balances,                   // FundBalances
  addTransaction,
  deductFromAcquisitionFund,
} = useFinance();
```

---

### `movements`

| Tipo | Descripción |
|---|---|
| `BalanceMovement[]` | Historial completo de ingresos y egresos, ordenado por más reciente |

---

### `balances`

| Tipo | Descripción |
|---|---|
| `FundBalances` | Saldos actuales de los fondos |

```typescript
interface FundBalances {
  cajaChica: number;          // Saldo Caja Chica (PEN)
  fondoAdquisicion: number;   // Saldo Fondo de Adquisición (PEN)
}
```

---

### `addTransaction(fund, type, amount, description, method)`

Registra un movimiento de ingreso o egreso y actualiza el saldo del fondo correspondiente.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `fund` | `FundSourceType` | ✅ | Fondo afectado: `'caja_chica'` o `'fondo_adquisicion'` |
| `type` | `'ingreso' \| 'egreso'` | ✅ | Tipo de movimiento |
| `amount` | `number` | ✅ | Monto en Soles PEN (valor positivo) |
| `description` | `string` | ✅ | Descripción narrativa del movimiento |
| `method` | `string` | ✅ | Método de pago/canal (ej: `'Yape_Plin'`, `'Efectivo'`) |

**Retorno**: `BalanceMovement` — El movimiento creado y registrado.

> **Nota**: El saldo nunca puede ser negativo. Si un egreso excede el saldo, el balance queda en `0`.

```typescript
// Registrar un ingreso en Caja Chica
const movement = addTransaction(
  'caja_chica',
  'ingreso',
  150,
  'Consignación MYPE "La Granjita" asignado a visita [Comedor Catacaos]',
  'Yape_Plin'
);

// Registrar un egreso en Fondo de Adquisición
addTransaction(
  'fondo_adquisicion',
  'egreso',
  300,
  'Balanceo Bolsa de [Visita Tambogrande]: compensación automática.',
  'Adquisición Compensatoria'
);
```

---

### `deductFromAcquisitionFund(cost, description)`

Atajo para registrar un egreso en el Fondo de Adquisición. Internamente llama a `addTransaction`.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `cost` | `number` | ✅ | Monto a deducir (en PEN) |
| `description` | `string` | ✅ | Descripción del gasto |

**Retorno**: `BalanceMovement` — El movimiento de egreso creado.

```typescript
// Tras un balanceo de inventario:
deductFromAcquisitionFund(
  result.spent,
  `Balanceo Bolsa de [${event.title}]: compensación automática.`
);

// Tras una compra directa de ítem:
deductFromAcquisitionFund(
  unitCost * qty,
  `Inyección Compensatoria: Adquisición de ${qty}u de "${itemName}".`
);
```

---

## 5. `useDonations`

**Archivo**: [`src/features/donations/hooks/useDonations.ts`](../src/features/donations/hooks/useDonations.ts)

**Descripción**: Hook de gestión del estado de microdonaciones de MYPEs. Mantiene el historial de donaciones y calcula métricas derivadas por MYPE.

**Clave de persistencia**: `'stare_donations'`

### Retorno completo

```typescript
const {
  donations,          // MicroDonation[]
  addDonation,
  getDonationMetrics,
} = useDonations();
```

---

### `donations`

| Tipo | Descripción |
|---|---|
| `MicroDonation[]` | Lista de todas las microdonaciones registradas, ordenada más reciente primero |

---

### `addDonation(donation)`

Registra una nueva microdonación al inicio del historial.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `donation` | `MicroDonation` | ✅ | Objeto donación completo (el ID debe ser generado por el llamador) |

**Retorno**: `void`

```typescript
addDonation({
  id: `don-${Date.now()}`,
  mypeName: 'Panadería San José',
  mypeCategory: 'Panadería',
  district: 'Piura',
  date: '2026-06-22',
  method: 'Especie',
  itemsDonated: [
    { itemName: 'Pan de molde', qty: 20 },
  ],
  eventId: 'ev-001',
  comment: 'Aporte en especie de Panadería. Insumos: 20u de Pan de molde.',
});
```

---

### `getDonationMetrics()`

Calcula métricas derivadas del historial de donaciones agrupadas por nombre de MYPE.

**Parámetros**: ninguno

**Retorno**: `{ counts: Record<string, number>; amounts: Record<string, number> }`

| Campo | Tipo | Descripción |
|---|---|---|
| `counts` | `Record<string, number>` | Mapa de `mypeName → número total de donaciones` |
| `amounts` | `Record<string, number>` | Mapa de `mypeName → suma total de aportes monetarios (PEN)` |

```typescript
const { counts, amounts } = getDonationMetrics();

// Cuántas donaciones tiene una MYPE:
const donCount = counts['La Granjita'] ?? 0;     // → 3

// Total aportado monetariamente:
const totalAmount = amounts['La Granjita'] ?? 0;  // → 250.00

// Pasar a un componente de directorio:
<MypeDirectory donationCounts={counts} donationAmounts={amounts} />
```

---

## 6. `useMypes`

**Archivo**: [`src/features/mypes/hooks/useMypes.ts`](../src/features/mypes/hooks/useMypes.ts)

**Descripción**: Hook de gestión del directorio de MYPEs (Micro y Pequeñas Empresas) locales. Maneja el registro de nuevas MYPEs y el flujo de selección para pre-llenar el formulario de captación.

**Clave de persistencia**: `'stare_mypes'`

### Retorno completo

```typescript
const {
  mypes,                  // MypeProfile[]
  selectedMypeToDonate,   // MypeProfile | null
  registerMype,
  selectMypeForDonation,
  clearSelectedMype,
} = useMypes();
```

---

### `mypes`

| Tipo | Descripción |
|---|---|
| `MypeProfile[]` | Directorio completo de MYPEs registradas |

---

### `selectedMypeToDonate`

| Tipo | Descripción |
|---|---|
| `MypeProfile \| null` | MYPE seleccionada para pre-cargar en el formulario de captación. Estado local (no persistido). |

---

### `registerMype(newMype)`

Registra una nueva MYPE en el directorio al inicio de la lista.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `newMype` | `MypeProfile` | ✅ | Perfil completo de la MYPE (ID generado por el llamador) |

**Retorno**: `void`

```typescript
registerMype({
  id: `mype-${Date.now()}`,
  name: 'Tienda Naturista El Verde',
  category: 'Salud Natural',
  district: 'Castilla',
  phone: '987654321',
  ruc: '10456789012',
});
```

---

### `selectMypeForDonation(mype)`

Selecciona una MYPE para pre-llenar el formulario de captación. La UI debe hacer scroll al formulario después de llamar esta función.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `mype` | `MypeProfile` | ✅ | MYPE a seleccionar |

**Retorno**: `void`

```typescript
// En AppRouter, al hacer clic en "Donar" desde el directorio:
selectMypeForDonation(selectedMype);
document.getElementById('captacion-wrapper-card')?.scrollIntoView({ behavior: 'smooth' });
```

---

### `clearSelectedMype()`

Limpia la MYPE seleccionada (llamar tras completar o cancelar el formulario de captación).

**Parámetros**: ninguno  
**Retorno**: `void`

```typescript
// Tras enviar el formulario de captación:
clearSelectedMype();
```

---

## 7. `useOrganizationManagement`

**Archivo**: [`src/features/organizations/hooks/useOrganizationManagement.ts`](../src/features/organizations/hooks/useOrganizationManagement.ts)

**Descripción**: Hook de gestión de organizaciones beneficiarias (comedores, escuelas, etc.) y sus eventos de intervención social. Permite registrar organizaciones, asociarles eventos y actualizar su estado.

**Claves de persistencia**: `'stare_org_management_orgs'`, `'stare_org_management_events'`

### Retorno completo

```typescript
const {
  organizations,        // Organization[]
  orgEvents,            // OrgSocialEvent[]
  addOrganization,
  addSocialEvent,
  updateEventStatus,
  deleteOrganization,
} = useOrganizationManagement();
```

---

### `organizations`

| Tipo | Descripción |
|---|---|
| `Organization[]` | Lista de organizaciones beneficiarias registradas |

---

### `orgEvents`

| Tipo | Descripción |
|---|---|
| `OrgSocialEvent[]` | Lista de eventos de intervención social asociados a organizaciones |

---

### `addOrganization(org)`

Registra una nueva organización beneficiaria. El ID es generado automáticamente.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `org` | `Omit<Organization, 'id'>` | ✅ | Datos de la organización sin ID |

**Retorno**: `Organization` — La organización creada con su ID asignado.

```typescript
const newOrg = addOrganization({
  nombre: 'Comedor Popular Virgen del Carmen',
  direccion: 'Jr. Los Lirios 123, Sector 5 - Piura',
  sector_demografico: 'Adultos Mayores y Madres de Familia',
  deficiencias_infraestructura: ['Sin agua potable', 'Infraestructura deteriorada'],
  nivel_prioridad: 'alta',
  distrito: 'Piura',
});
// newOrg.id → 'org-1719000000000'
```

---

### `addSocialEvent(event)`

Agrega un nuevo evento de intervención a una organización. El ID es generado automáticamente.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `event` | `Omit<OrgSocialEvent, 'id'>` | ✅ | Datos del evento sin ID |

**Retorno**: `OrgSocialEvent` — El evento creado con su ID asignado.

```typescript
const newEvent = addSocialEvent({
  organization_id: 'org-1',
  fecha_programada: '2026-08-15',
  tipo_intervencion: 'infraestructura',
  estado: 'pendiente',
  voluntarios_requeridos: 10,
});
// newEvent.id → 'ev-1719000000000'
```

---

### `updateEventStatus(eventId, status)`

Actualiza el estado de un evento de intervención.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | ✅ | ID del evento a actualizar |
| `status` | `OrgEventStatus` | ✅ | Nuevo estado: `'pendiente'`, `'en_progreso'`, `'completado'`, `'cancelado'` |

**Retorno**: `void`

```typescript
// Marcar evento como en progreso
updateEventStatus('ev-org-1', 'en_progreso');

// Marcar como completado
updateEventStatus('ev-org-1', 'completado');
```

---

### `deleteOrganization(orgId)`

Elimina una organización y **todos sus eventos de intervención** asociados.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `orgId` | `string` | ✅ | ID de la organización a eliminar |

**Retorno**: `void`

> **Advertencia**: Esta operación es irreversible en el almacenamiento local. Elimina en cascada todos los `OrgSocialEvent` con `organization_id === orgId`.

```typescript
// Eliminar organización y sus eventos asociados
deleteOrganization('org-2');
```

---

## 8. Handlers de AppRouter

**Archivo**: [`src/app/router/AppRouter.tsx`](../src/app/router/AppRouter.tsx)

**Descripción**: Los handlers del `AppRouter` son funciones compuestas que orquestan múltiples features simultáneamente. Cada handler coordina llamadas a hooks de distintos dominios para mantener la consistencia de datos entre features.

---

### `handleRegisterDonation(...)`

Registra una microdonación y propaga los efectos secundarios correspondientes:
1. Llama a `addDonation()` (feature: donations)
2. Si es donación **en especie** y tiene evento asignado, llama a `updateBolsaFromDonation()` (feature: events)
3. Si es donación **monetaria**, llama a `addTransaction()` (feature: finance)

**Firma completa**:

```typescript
handleRegisterDonation(
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
) => void
```

**Parámetros**:

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | ✅ | ID del evento destino. Usar `'stock_general'` para donaciones sin evento asignado |
| `mypeName` | `string` | ✅ | Nombre de la MYPE donante |
| `category` | `string` | ✅ | Categoría comercial de la MYPE (ej: `'Alimentos'`) |
| `district` | `PiuraDistrict` | ✅ | Distrito de Piura donde opera la MYPE |
| `method` | `DonationMethod` | ✅ | Canal: `'Efectivo_CajaChica'`, `'Yape_Plin'`, `'Especie'` |
| `amount` | `number` | ❌ | Monto en PEN (solo si `method !== 'Especie'`) |
| `itemsDonated` | `{ itemName: string; qty: number }[]` | ❌ | Ítems físicos donados (solo si `method === 'Especie'`) |
| `additionalData.ruc` | `string` | ❌ | RUC de la MYPE |
| `additionalData.phone` | `string` | ❌ | Teléfono de contacto |
| `additionalData.fundDestination` | `FundSourceType` | ❌ | Fondo destino para aportes monetarios (por defecto: `'fondo_adquisicion'` para Yape/Plin) |
| `additionalData.txNumber` | `string` | ❌ | Código de operación Yape/Plin |
| `additionalData.receiptFileName` | `string` | ❌ | Nombre del archivo de comprobante adjunto |

**Retorno**: `void`

```typescript
// Donación monetaria vía Yape
handleRegisterDonation(
  'ev-001',
  'Farmacia Salud Total',
  'Farmacia',
  'Piura',
  'Yape_Plin',
  100,                          // amount
  undefined,                    // itemsDonated
  {
    phone: '987654321',
    txNumber: 'YPE-9876543',
    fundDestination: 'fondo_adquisicion',
  }
);

// Donación en especie
handleRegisterDonation(
  'ev-002',
  'La Granjita Feliz',
  'Alimentos',
  'Castilla',
  'Especie',
  undefined,                    // amount (no aplica)
  [
    { itemName: 'Arroz 5kg', qty: 8 },
    { itemName: 'Frijoles 1kg', qty: 5 },
  ],
);
```

---

### `handleBalanceInventory(eventId, maxBudget)`

Balancea el inventario de la bolsa de un evento usando el Fondo de Adquisición. Coordina:
1. `balanceInventory()` (feature: events) — calcula y aplica compras
2. `deductFromAcquisitionFund()` (feature: finance) — registra el egreso si fue exitoso

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | ✅ | ID del evento cuya bolsa se balanceará |
| `maxBudget` | `number` | ✅ | Presupuesto máximo a gastar (en PEN) |

**Retorno**: `{ success: boolean; spent: number; msg: string }`

| Campo | Tipo | Descripción |
|---|---|---|
| `success` | `boolean` | `true` si se realizó al menos una compra |
| `spent` | `number` | Monto efectivamente gastado (en PEN) |
| `msg` | `string` | Mensaje descriptivo del resultado |

```typescript
const result = handleBalanceInventory('ev-001', 500);

if (result.success) {
  alert(`Balanceo exitoso. Gastado: S/. ${result.spent.toFixed(2)}\n${result.msg}`);
} else {
  alert(`No se pudo balancear: ${result.msg}`);
}
```

---

### `handleDirectBuyItem(eventId, itemId, qtyToBuy, cost, itemName)`

Compra directa de un ítem específico de la bolsa de un evento. Coordina:
1. `deductFromAcquisitionFund()` (feature: finance) — registra el egreso
2. `directBuyItem()` (feature: events) — incrementa el inventario del ítem

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `eventId` | `string` | ✅ | ID del evento que contiene el ítem |
| `itemId` | `string` | ✅ | ID del ítem dentro de la bolsa del evento |
| `qtyToBuy` | `number` | ✅ | Cantidad de unidades a comprar |
| `cost` | `number` | ✅ | Costo total de la compra (en PEN) |
| `itemName` | `string` | ✅ | Nombre del ítem (para la descripción del movimiento financiero) |

**Retorno**: `void`

```typescript
// Comprar 10 unidades de "Arroz 5kg" con costo total de S/. 50
handleDirectBuyItem(
  'ev-001',         // eventId
  'item-arroz',     // itemId
  10,               // qtyToBuy
  50,               // cost
  'Arroz 5kg'       // itemName
);
// Efecto: resta S/. 50 del Fondo de Adquisición + suma 10 unidades al inventario
```

---

## Tipos de Referencia

### `DonationMethod`
```typescript
type DonationMethod = 'Efectivo_CajaChica' | 'Yape_Plin' | 'Especie';
```

### `FundSourceType`
```typescript
type FundSourceType = 'caja_chica' | 'fondo_adquisicion';
```

### `PiuraDistrict`
```typescript
// Derivado de PIURA_DISTRICTS en shared/constants/districts.constants.ts
type PiuraDistrict =
  | 'Piura' | 'Castilla' | 'Catacaos' | 'Tambogrande'
  | 'La Unión' | 'Sechura' | 'Morropón' | 'Chulucanas'
  | 'Ayabaca' | 'Huancabamba' | 'Paita' | 'Talara';
```

### `ActiveScreen`
```typescript
// src/app/config/app.config.ts
type ActiveScreen = 'dashboard' | 'captacion' | 'balance' | 'voluntario' | 'organizaciones';
```

---

*Última actualización: Junio 2026 — Mantenido por el equipo de desarrollo de STARE Piura*
