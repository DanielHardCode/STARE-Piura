<div align="center">
  <img width="1200" height="475" alt="STARE Piura Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
  
  # 🇵🇪 STARE Piura
  ### **Sistema de Trazabilidad y Asignación de Recursos para Entidades de Apoyo Social**
  
  [![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 📋 Descripción del Proyecto

**STARE Piura** es una plataforma digital de gestión humanitaria y logística diseñada específicamente para la **Prefectura Zonal de Piura, Perú**. Su objetivo principal es optimizar la captación, trazabilidad y distribución de recursos destinados a comedores populares, asilos, albergues y comunidades vulnerables de la región, garantizando transparencia absoluta en cada movimiento.

La aplicación opera bajo un enfoque **Offline-First**, lo que permite a los coordinadores sociales registrar donaciones, actualizar inventarios y planificar visitas de campo directamente en áreas rurales o periféricas sin necesidad de una conexión a internet activa, sincronizándose automáticamente una vez restablecida la red.

---

## ✨ Características Principales

La aplicación se divide en 7 módulos integrados que cubren todas las necesidades operativas:

1. **🚀 Command-Center Logístico (Dashboard):** Panel central con KPIs interactivos de fondos (Caja Chica, Fondo de Adquisición) y el Kardex completo de movimientos financieros (ingresos y egresos).
2. **📅 Cronograma y Visitas:** Calendario interactivo para programar y visualizar visitas de asistencia social a organizaciones locales.
3. **📦 Cobertura de Bolsas de Evento:** Monitoreo visual detallado y en tiempo real de artículos y suministros (víveres, medicina, abrigo) requeridos para cada evento programado.
4. **🤝 Captación de Microdonaciones:** Registro simplificado de donaciones monetarias (a través de Yape, Plin, Efectivo o transferencia) y en especie provenientes de la comunidad.
5. **🏢 Directorio MYPE:** Catálogo estructurado de Micro y Pequeñas Empresas aliadas en Piura, con historial y rubros de aporte.
6. **🏛️ Organizaciones Beneficiarias:** Directorio de entidades de apoyo social (comedores, vasos de leche, asilos) con perfiles de necesidades detallados y programación directa de ayuda.
7. **📊 Balance Financiero y Brechas:** Herramienta analítica que identifica automáticamente déficits de recursos y propone balanceos automáticos para mitigar carencias urgentes.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 19 (SPA) con TypeScript 5.8 (Modo Estricto).
- **Diseño & Estilos:** TailwindCSS 4 y Lucide React para una interfaz moderna, limpia y adaptativa.
- **Animaciones:** Framer Motion (Motion v11+) para transiciones de pantalla dinámicas y micro-interacciones.
- **Construcción & Servidor:** Vite 6 para un desarrollo ultrarrápido y empaquetamiento optimizado.
- **Persistencia:** Almacenamiento local reactivo (`localStorage`) con estrategias offline y prefijo de seguridad `stare_`.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
Asegúrate de tener instalado **Node.js** (versión 20 o superior) y **npm** en tu equipo.

### Pasos para Ejecutar
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/DanielHardCode/STARE-Piura.git
   cd stare-piura
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo `.env.example` como `.env.local` (o `.env`) y coloca tu clave de API correspondiente:
   ```bash
   cp .env.example .env.local
   ```
4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación en funcionamiento.

---

## 📚 Documentación Técnica y de Usuario

Para profundizar en la arquitectura del sistema, guías de estilo o el manual de usuario, revisa la documentación detallada disponible en la carpeta `/docs`:

* 🏗️ **[docs/ARCHITECTURE.md](file:///D:/stare-piura/docs/ARCHITECTURE.md):** Arquitectura detallada del sistema, patrón Feature-Folder y flujo de datos.
* 🛠️ **[docs/DEVELOPER_GUIDE.md](file:///D:/stare-piura/docs/DEVELOPER_GUIDE.md):** Manual técnico para desarrolladores, configuración, creación de módulos, hooks y pruebas.
* 📏 **[docs/CODING_GUIDELINES.md](file:///D:/stare-piura/docs/CODING_GUIDELINES.md):** Directrices y convenciones de codificación, tipado y JSDoc.
* 🎨 **[docs/STYLE_GUIDE.md](file:///D:/stare-piura/docs/STYLE_GUIDE.md):** Guía de estilo UI/UX, paleta de colores, tipografía y accesibilidad.
* 📁 **[docs/STATE_MANAGEMENT.md](file:///D:/stare-piura/docs/STATE_MANAGEMENT.md):** Arquitectura del flujo de estado local, persistencia local y offline-first.
* 🔌 **[docs/API.md](file:///D:/stare-piura/docs/API.md):** Documentación detallada de interfaces, hooks, servicios y endpoints locales.
* 📖 **[docs/USER_MANUAL.md](file:///D:/stare-piura/docs/USER_MANUAL.md):** Manual operativo y de usuario paso a paso para el personal de la Prefectura Zonal.
* 🗺️ **[docs/ROADMAP.md](file:///D:/stare-piura/docs/ROADMAP.md):** Planificación, hoja de ruta e hitos de desarrollo a corto y mediano plazo.
* 📝 **[docs/CHANGELOG.md](file:///D:/stare-piura/docs/CHANGELOG.md):** Historial de cambios, versiones del sistema y notas de lanzamiento.

---

*Desarrollado y mantenido para la Prefectura Zonal de Piura, Perú. 2026.*
