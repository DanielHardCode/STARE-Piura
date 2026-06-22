# Historial de Cambios — STARE Piura

> Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.1.0/)  
> Este proyecto usa [Versionado Semántico](https://semver.org/lang/es/)

---

## [Sin lanzar] — Unreleased

### Planificado
- Exportación de reportes en formato PDF
- Filtros avanzados en listados (por fecha, monto, tipo)
- Vista de impresión para kardex de movimientos
- Notificaciones internas cuando la cobertura de una bolsa baja del 30%
- Integración con API de Supabase para sincronización en la nube

---

## [v1.0.0] — 2026-06-22

Versión inicial de lanzamiento de STARE Piura. Sistema completo de trazabilidad y asignación de recursos humanitarios para la Prefectura Zonal de Piura.

### Agregado

#### Sistema General
- Arquitectura offline-first basada en localStorage del navegador
- Layout principal con sidebar fijo de navegación y área de contenido scrolleable
- Navegación entre 7 módulos del sistema sin recarga de página (SPA)
- Datos semilla (seed data) precargados para demostración del sistema
- Soporte completo para dispositivos de escritorio y tablet
- Animaciones de entrada y transición usando Motion (Framer Motion v11+)
- Sistema de iconografía usando Lucide React

#### Módulo 1 — Command-Center Logístico (Dashboard)
- Tarjetas KPI para: Caja Chica, Fondo de Adquisición, Total Donado este Mes, Eventos Programados
- Indicadores visuales de tendencia (TrendingUp / TrendingDown) en KPIs
- Tabla de Kardex de movimientos financieros con columnas: fecha, descripción, tipo, fondo, monto, saldo
- Diferenciación visual de ingresos (verde) y egresos (rojo) en el kardex
- Formulario modal para registrar nueva transacción (ingreso / egreso)
- Selección de fondo de destino: Caja Chica o Fondo de Adquisición
- Categorías de transacción: Alimentación, Medicamentos, Transporte, Materiales, Donación recibida, Otros
- Cálculo automático de saldo actualizado por fondo

#### Módulo 2 — Cronograma y Visitas
- Calendario mensual interactivo con visualización de eventos
- Indicadores de días con eventos (puntos de color)
- Lista de próximos eventos con detalles: nombre, fecha, hora, lugar, organización
- Formulario para crear nuevo evento con campos: nombre, fecha, hora de inicio, lugar, organización beneficiaria, descripción
- Navegación entre meses (anterior / siguiente)
- Vista de detalle de evento al hacer clic en el día del calendario

#### Módulo 3 — Cobertura de Bolsas de Evento
- Listado de bolsas de evento con resumen de cobertura por ítem
- Barras de progreso con color semántico según porcentaje de cobertura:
  - Verde (≥ 80%), Ámbar (50-79%), Amarillo (30-49%), Rojo (< 30%)
- Etiquetas de porcentaje numérico junto a cada barra
- Detalle de bolsa con listado de ítems: leche en polvo, frazadas, medicamentos básicos, víveres, útiles escolares, ropa, otros
- Formulario para actualizar unidades disponibles de cada ítem
- Indicador de unidades disponibles vs. meta requerida
- Agrupación de bolsas por evento

#### Módulo 4 — Captación de Microdonaciones
- Formulario de registro de donación con campos: donante, tipo (monetaria/especie), método de pago, monto/cantidad, artículo (si especie), valor estimado, fondo destino, fecha, observaciones
- Soporte de métodos de pago: Yape, Plin, Efectivo, Transferencia
- Soporte de donaciones en especie con campo de artículo y cantidad
- Listado de donaciones registradas en orden cronológico descendente
- Badges de color por tipo: Yape (azul), Plin (verde), Efectivo (esmeralda), Especie (índigo)
- Estadísticas de resumen: total donado en el período, número de donantes, donación promedio
- Búsqueda de donaciones por nombre de donante

#### Módulo 5 — Directorio MYPE
- Directorio de micro y pequeñas empresas donantes con tarjetas informativas
- Campos por MYPE: nombre comercial, rubro, propietario, teléfono, dirección, tipo de aporte habitual
- Búsqueda en tiempo real por nombre o rubro
- Indicador de historial de aporte (última donación, monto total aportado)
- Filtro por tipo de aporte (monetario / especie)
- Formulario de alta de nueva MYPE

#### Módulo 6 — Organizaciones y Eventos
- Registro de organizaciones beneficiarias: comedores populares, asilos, colegios, organizaciones religiosas
- Campos por organización: nombre, tipo, responsable, distrito, dirección, teléfono, número de beneficiarios
- Acción de "Programar Visita" desde el perfil de organización (genera evento en Cronograma)
- Listado de organizaciones con búsqueda por nombre o tipo
- Indicador de próxima visita programada para cada organización
- Formulario de alta de nueva organización

#### Módulo 7 — Balance Financiero y Brechas
- Tabla de déficit por ítem: muestra artículo, unidades disponibles, meta, faltante, porcentaje de cobertura
- Resumen financiero por fondo: saldo disponible vs. comprometido
- Herramienta de Balanceo Automático: análisis y propuesta de redistribución de recursos
- Vista de brechas ordenadas por urgencia (mayor déficit primero)
- Indicadores de color en la tabla según criticidad
- Resumen ejecutivo: total de brechas identificadas, valor total del déficit en soles

### Arquitectura

#### Frontend
- **Framework:** React 19 con TypeScript estricto (`strict: true`)
- **Bundler:** Vite 6 con Hot Module Replacement (HMR)
- **CSS:** TailwindCSS 4 con configuración `@import "tailwindcss"`
- **Animaciones:** Motion (Framer Motion v11+) con `AnimatePresence`
- **Iconos:** Lucide React

#### Estructura del Proyecto
- Arquitectura basada en features (`src/features/<nombre>/`)
- Un hook de feature por módulo (`use<Feature>.ts`)
- Hook base `useLocalStorage<T>` para persistencia tipo-segura
- Tipos TypeScript por feature en `src/features/<feature>/types.ts`
- AppRouter como única fuente de estado global (módulo activo, configuración)

#### Persistencia
- Almacenamiento local en `localStorage` del navegador
- Claves prefijadas con `stare_` para evitar colisiones
- Inicialización con datos semilla controlada por clave `stare_seed_v1`

#### Convenciones
- Componentes en PascalCase, hooks en camelCase con prefijo `use`
- IDs generados con `crypto.randomUUID()`
- Fechas almacenadas en formato ISO 8601
- Montos en soles (S/) como números `number` (no string)

### Pendiente para v1.1.0

- [ ] Exportación de datos (JSON / CSV)
- [ ] Modo oscuro del área de contenido
- [ ] Filtros y paginación en listados con más de 50 registros
- [ ] Validación de formularios con mensajes de error en línea
- [ ] Acceso por rol (coordinador vs. visualizador)
- [ ] Impresión de reportes
- [ ] Historial de auditoría (quién y cuándo registró cada dato)

---

*STARE Piura — Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social*  
*Desarrollado para la Prefectura Zonal de Piura, Perú.*
