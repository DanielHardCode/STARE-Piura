# 📋 Plan de Implementación: Módulo "Visitas de Campo" (Voluntario de Trazabilidad)

Este documento detalla la especificación del nuevo módulo responsivo de trazabilidad para voluntarios de campo y los cambios estructurales previos requeridos en la base del proyecto **STARE Piura**.

---

## 👥 1. Perfil del Usuario: "Voluntario de Trazabilidad"
Se define un nuevo rol de usuario en el sistema con un flujo operativo restringido y simplificado:
* **Acceso Exclusivo:** Al iniciar sesión con credenciales de voluntario, el sistema ocultará toda la barra de navegación lateral tradicional (Command Center, Microdonaciones, Balance, Organizaciones).
* **Pantalla de Inicio Dedicada:** El voluntario será redirigido inmediatamente y de forma obligatoria a la lista de tareas pendientes de entrega de este módulo. No tendrá forma de navegar a otras secciones.
* **Interfaz Limpia:** Se implementará un encabezado minimalista con la información del voluntario, el indicador de conexión (Offline/Online) y el botón de cerrar sesión.

---

## 🚚 2. Lógica de Negocio y Tarjetas de Tarea
* **Generación Automática:** En lugar de mostrar un selector con todos los eventos del sistema, el módulo mostrará una cuadrícula o lista de **Tarjetas de Entrega**.
* **Condición de Aparición:** Una tarjeta se generará y mostrará en la vista del voluntario **únicamente** cuando un evento de apoyo social se encuentre en estado **`"En curso"`** (`en_curso`) en la base de datos.
* **Estados del Evento en el Flujo:**
  ```mermaid
  graph LR
      A[Programado] --> B[En curso]
      B -->|Aparece en app voluntario| C[Entrega en Proceso]
      C -->|Verificado y Firmado| D[Realizada/Completada]
  ```

---

## 🛠️ 3. Cambios Previos Necesarios (Prerrequisitos)
Antes de construir el componente de interfaz o vista del módulo, se deben realizar las siguientes modificaciones en el núcleo de la aplicación:

### A. Base de Datos / Tipados de Usuario (`src/types/` y `src/stores/auth.ts`)
1. **Tipado del Rol:** Agregar el rol `'voluntario'` al tipo de rol de usuario en la aplicación:
   ```typescript
   export type UserRole = 'admin' | 'coordinador' | 'voluntario';
   ```
2. **Usuarios Mock de Prueba:** Añadir credenciales rápidas de prueba para el voluntario en el componente de Login (ej. `voluntario@starepiura.org` / `voluntario123`) asociando el rol correspondiente.

### B. Enrutador y Control de Navegación (`src/app/router/AppRouter.tsx`)
1. **Redirección Obligatoria:** Si `user.role === 'voluntario'`, forzar el estado `activeScreen` a la pantalla del nuevo módulo e ignorar cualquier intento de cambio.
2. **Filtro de Datos de Rutas:** Filtrar los eventos de apoyo consumidos de Zustand para que solo aquellos con `status === 'en_curso'` se pasen al componente del voluntario.

### C. Menú y Layout (`src/layouts/AppLayout.tsx` y `Sidebar.tsx`)
1. **Ocultamiento de Menús:** Si el rol es `'voluntario'`, ocultar la barra lateral completa (`Sidebar`) en desktop y el menú inferior (`BottomNav`) en móviles. Reemplazarlo por una barra de navegación superior simplificada:
   * **Contenido:** Logo simplificado de STARE Piura, Badge de sincronización offline, Nombre del Voluntario y botón de Cerrar Sesión.

---

## 📱 4. Requerimientos de la Interfaz Responsiva (UI/UX)
El módulo se comportará de la siguiente manera según el dispositivo:

| Característica | En Dispositivo Móvil | En Escritorio (Desktop) |
| :--- | :--- | :--- |
| **Maquetado (Layout)** | Columna única vertical fluida (100% del ancho del dispositivo). | Diseño a doble columna (Lista de tarjetas a la izquierda, detalle/firma a la derecha). |
| **Marcos decorativos** | **Ninguno.** Sin marcos artificiales de smartphone o bocinas. | (Opcional) Contenedor limitado para visualización de pruebas de diseño. |
| **Documentación técnica** | Oculta por completo para evitar distracciones en el campo. | Visible a un costado (opcional para desarrollo). |
| **Tamaño de Botones** | Targets táctiles grandes (mínimo 48px) para operar en movimiento. | Botones y controles de tamaño estándar para mouse. |

---

## 🖼️ 5. Especificaciones de la Evidencia y Firma
* **Evidencias en Diferido:** Se elimina la obligatoriedad de subir fotos en el instante de registrar la firma. La entrega se puede archivar y las imágenes se pueden adjuntar más tarde.
* **Límite de Imágenes:** Se habilita un input file múltiple (`accept="image/*"`) que permite almacenar y subir un máximo de **3 imágenes** por evento.
* **Firma Obligatoria:** El cuadro de dibujo para la firma digital del encargado del comedor o albergue se mantiene como requerimiento obligatorio para poder guardar el reporte (local u online).
