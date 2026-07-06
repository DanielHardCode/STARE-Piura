<div align="center">
  <img width="1200" height="475" alt="STARE Piura Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
  
  # 🇵🇪 STARE Piura
  ### **Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social**
  
  [![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
  [![Laravel](https://img.shields.io/badge/Laravel-13.0-red.svg)](https://laravel.com/)
  [![PHP](https://img.shields.io/badge/PHP-8.4-777bb4.svg)](https://www.php.net/)
  [![Supabase](https://img.shields.io/badge/Supabase-3.0-3ecf8e.svg)](https://supabase.com/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Descripción del Proyecto

**STARE Piura** es una plataforma digital de gestión humanitaria y logística diseñada específicamente para la **Prefectura Zonal de Piura, Perú**. Su objetivo principal es optimizar la captación, trazabilidad y distribución de recursos destinados a comedores populares, asilos, albergues y comunidades vulnerables de la región, garantizando transparencia absoluta en cada movimiento.

La aplicación opera bajo un enfoque **Offline-First**, lo que permite a los coordinadores sociales registrar donaciones, actualizar inventarios y planificar visitas de campo directamente en áreas rurales o periféricas sin necesidad de una conexión a internet activa, sincronizándose automáticamente una vez restablecida la red.

---

## 🏗️ Arquitectura del Sistema

STARE Piura utiliza una **arquitectura de tres capas** con un backend Laravel que actúa como proxy REST hacia Supabase:

```
[Frontend React] → [API Laravel] → [Supabase REST API] → [PostgreSQL]
       ↓                                    ↓
 [Supabase Auth]                    [Validación JWT + Roles]
```

### 🔄 Tres modos de operación

El sistema puede funcionar en tres modos diferentes, configurables mediante la variable `VITE_DATA_PROVIDER`:

| Modo | Descripción | Uso |
|------|-------------|-----|
| `mock` | Datos falsos generados con Faker.js | Desarrollo offline sin dependencias |
| `supabase` | Conexión directa a Supabase desde el frontend | Producción simplificada |
| `supabase_laravel` | Frontend consume API Laravel, que a su vez consulta Supabase | Producción con lógica de negocio |

### 🔐 Autenticación y Autorización

- **Autenticación**: Supabase Auth con JWT (algoritmo ES256).
- **Validación**: Middleware `AuthenticateSupabase` que obtiene las claves JWKS desde Supabase y verifica el token.
- **Autorización**: Middleware `CheckRole` que restringe el acceso según el rol del usuario.

### 👥 Roles del Sistema

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso total: Dashboard, Captación, Balance, Organizaciones, Eventos, Usuarios |
| **coordinador** | Dashboard, Captación, Organizaciones, Eventos |
| **voluntario** | Solo pantalla de Visitas de Campo |

---

## ✨ Módulos del Sistema

La aplicación se divide en **8 módulos integrados** que cubren todas las necesidades operativas:

1. **🚀 Command-Center Logístico (Dashboard):** Panel central con KPIs interactivos de fondos (Caja Chica, Fondo de Adquisición) y el Kardex completo de movimientos financieros.

2. **🤝 Captación de Microdonaciones:** Registro simplificado de donaciones monetarias (Yape, Plin, Efectivo, Transferencia) y en especie.

3. **🏢 Directorio MYPE:** Catálogo estructurado de Micro y Pequeñas Empresas aliadas con historial de aportes.

4. **🏛️ Organizaciones Beneficiarias:** Directorio de comedores, albergues, asilos con perfiles de necesidades y programación de ayuda.

5. **📅 Eventos de Ayuda:** Calendario interactivo para programar visitas sociales, asignar voluntarios y monitorear cobertura de suministros.

6. **📊 Balance Financiero y Brechas:** Herramienta analítica que identifica déficits y propone balanceos automáticos (solo admin).

7. **👥 Usuarios y Roles:** Gestión de perfiles de usuario (solo admin). Permite registrar nuevos coordinadores y voluntarios.

8. **📸 Visitas de Campo (Voluntario):** Interfaz móvil para voluntarios con captura de evidencias fotográficas, firma de conformidad y sincronización offline.

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** (SPA) con TypeScript 5.8 (Modo Estricto)
- **TailwindCSS 4** y Lucide React para interfaz moderna y adaptativa
- **Motion (Framer Motion)** para animaciones y transiciones
- **Zustand** para estado global
- **Vite 6** para desarrollo ultrarrápido

### Backend
- **Laravel 13** con PHP 8.4
- **SupabaseService** como cliente REST para Supabase
- **Firebase PHP-JWT** para validación de tokens JWT (ES256 + JWKS)
- **Docker** para despliegue en Render

### Base de Datos
- **Supabase** (PostgreSQL) con Row Level Security
- **Supabase Storage** para archivos (imágenes de evidencias)

### Tablas Principales
`organizations`, `mypes`, `donors`, `events`, `donations`, `supply_items`, `transactions`, `notifications`, `supply_bags`, `profiles`, `visit_evidences`

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- **Node.js** 20+ y npm
- **PHP** 8.4+
- **Composer** 2.x
- Cuenta en [Supabase](https://supabase.com)

### 1. Clonar el repositorio
```bash
git clone https://github.com/DanielHardCode/STARE-Piura.git
cd STARE-Piura
```

### 2. Configurar el Frontend
```bash
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
npm run dev
```

### 3. Configurar el Backend
```bash
cd server
composer install
cp .env.example .env
# Editar .env con DB_CONNECTION=sqlite (desarrollo local)
touch database/database.sqlite
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 4. Configurar Supabase
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar los scripts SQL en el Editor SQL:
   - `server/database/supabase/visit_evidences.sql`
   - `server/database/supabase/cubrir_suministro.sql`
3. Crear usuarios de prueba en **Authentication > Users**

### 5. Variables de Entorno

**Frontend (`.env.local`):**
```env
VITE_DATA_PROVIDER=supabase_laravel
VITE_SUPABASE_URL=https://cglmqbyumqlwxfliajxs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_LARAVEL_API_URL=http://localhost:8000/api
```

**Backend (`server/.env`):**
```env
APP_URL=http://localhost:8000
SUPABASE_URL=https://cglmqbyumqlwxfliajxs.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# Desarrollo local
DB_CONNECTION=sqlite

# Producción (Render)
# DB_CONNECTION=pgsql
# DB_HOST=db.xxxx.supabase.co
# DB_PORT=5432
```

---

## 🔌 API Endpoints (55 rutas)

### CRUD Principal (admin + coordinador)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST/PUT/DELETE | `/api/organizations` | Organizaciones beneficiarias |
| GET/POST/PUT/DELETE | `/api/mypes` | Micro y pequeñas empresas |
| GET/POST/PUT/DELETE | `/api/donors` | Donantes |
| GET/POST/PUT/DELETE | `/api/donations` | Donaciones |
| GET/POST/PUT/DELETE | `/api/events` | Eventos |
| GET/POST/PUT/DELETE | `/api/supply-items` | Ítems de suministro |
| GET/POST/PUT/DELETE | `/api/supply-bags` | Bolsas de suministro |
| GET/POST/PUT/DELETE | `/api/transactions` | Transacciones financieras |
| GET/POST/PUT/DELETE | `/api/notifications` | Notificaciones |

### Rutas Especiales
| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| GET | `/api/balances` | admin | Balance por fondos |
| POST | `/api/supply-items/cubrir` | admin/coord | Cobertura transaccional |
| PUT | `/api/notifications/{id}/read` | auth | Marcar notificación leída |
| POST | `/api/notifications/read-all` | auth | Marcar todas leídas |

### Usuarios (solo admin)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users` | Listar perfiles |
| GET | `/api/users/{id}` | Ver perfil |
| POST | `/api/users/register` | Registrar nuevo usuario |
| PUT | `/api/users/{id}` | Actualizar perfil |

### Visitas de Campo (voluntario)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/events/{id}/evidences` | Ver evidencias |
| POST | `/api/events/{id}/evidences` | Guardar evidencias |
| PUT | `/api/events/{id}/complete` | Finalizar visita |

---

## 🔒 Gestión de Transacciones

El sistema implementa **control de concurrencia** para la cobertura de suministros, resolviendo el problema clásico del "asiento de avión": cuando varios coordinadores intentan cubrir la última unidad disponible de un ítem, solo el primero lo consigue.

La función `cubrir_suministro` en Supabase realiza una actualización atómica:
```sql
UPDATE supply_items
SET cantidad_cubierta = cantidad_cubierta + 1
WHERE id = p_item_id
  AND cantidad_cubierta < cantidad_requerida;
```

Si no hay disponibilidad, el backend retorna **409 Conflict**.

---

## 📚 Documentación

Para profundizar en la arquitectura del sistema, guías de estilo o el manual de usuario, revisa la documentación disponible en la carpeta `/docs`:

| Archivo | Descripción |
|---------|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura detallada, patrón Feature-Folder y flujo de datos |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Manual técnico para desarrolladores |
| [docs/CODING_GUIDELINES.md](docs/CODING_GUIDELINES.md) | Convenciones de codificación y tipado |
| [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) | Guía de estilo UI/UX y accesibilidad |
| [docs/STATE_MANAGEMENT.md](docs/STATE_MANAGEMENT.md) | Flujo de estado local y offline-first |
| [docs/API.md](docs/API.md) | Documentación de endpoints y servicios |
| [docs/USER_MANUAL.md](docs/USER_MANUAL.md) | Manual operativo para el personal |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Hoja de ruta e hitos de desarrollo |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Historial de cambios y versiones |

---

*Desarrollado y mantenido para la Prefectura Zonal de Piura, Perú. 2026.*