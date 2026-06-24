import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Mocks imports
import {
  MOCK_ORGANIZATIONS,
  MOCK_MYPES,
  MOCK_DONORS,
  MOCK_DONATIONS,
  MOCK_EVENTS,
  MOCK_SUPPLY_ITEMS,
  MOCK_TRANSACTIONS,
  MOCK_NOTIFICATIONS
} from '../src/mocks/index.js';

// Resolve directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeString(val: string): string {
  return val.replace(/'/g, "''");
}

function sqlVal(val: any): string {
  if (val === null || val === undefined) {
    return 'NULL';
  }
  if (typeof val === 'boolean') {
    return val ? 'TRUE' : 'FALSE';
  }
  if (typeof val === 'number') {
    return String(val);
  }
  if (typeof val === 'string') {
    return `'${escapeString(val)}'`;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) {
      return 'ARRAY[]::text[]';
    }
    const escapedElements = val.map(el => `'${escapeString(String(el))}'`).join(', ');
    return `ARRAY[${escapedElements}]::text[]`;
  }
  if (typeof val === 'object') {
    const jsonStr = JSON.stringify(val);
    return `'${escapeString(jsonStr)}'::jsonb`;
  }
  return 'NULL';
}

function generateInsert(table: string, columns: string[], rows: any[]): string {
  if (rows.length === 0) return `-- No hay datos para insertar en ${table}\n\n`;
  
  let sql = `-- Inserción de datos en la tabla ${table} (${rows.length} registros)\n`;
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    sql += `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n`;
    sql += chunk.map(row => {
      const values = columns.map(col => sqlVal(row[col])).join(', ');
      return `  (${values})`;
    }).join(',\n') + ';\n\n';
  }
  
  return sql;
}

async function main() {
  console.log('Generando archivo SQL para Supabase...');

  let sqlContent = `-- SQL Script auto-generado para STARE Piura en Supabase
-- Fecha: ${new Date().toISOString()}

-- 1. HABILITAR EXTENSIONES NECESARIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ELIMINACIÓN DE TABLAS PREVIAS (Para re-generación limpia)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS supply_items CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS donors CASCADE;
DROP TABLE IF EXISTS mypes CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- 3. CREACIÓN DE TABLAS

-- Tabla: organizaciones beneficiarias
CREATE TABLE organizations (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    direccion TEXT NOT NULL,
    distrito VARCHAR(100) NOT NULL,
    telefono VARCHAR(50),
    encargado VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    beneficiarios_estimados INT NOT NULL,
    necesidades TEXT[] NOT NULL DEFAULT ARRAY[]::text[],
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: MYPEs aliadas
CREATE TABLE mypes (
    id VARCHAR(50) PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    ruc VARCHAR(20) NOT NULL UNIQUE,
    rubro VARCHAR(50) NOT NULL,
    contacto VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    distrito VARCHAR(100) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    historial_aportes DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Donantes
CREATE TABLE donors (
    id VARCHAR(50) PRIMARY KEY,
    nombres VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    distrito VARCHAR(100),
    mype_id VARCHAR(50) REFERENCES mypes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Eventos / Visitas
CREATE TABLE events (
    id VARCHAR(50) PRIMARY KEY,
    organization_id VARCHAR(50) REFERENCES organizations(id) ON DELETE SET NULL,
    organization_nombre VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    distrito VARCHAR(100) NOT NULL,
    target_audience VARCHAR(255) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL,
    coordinador_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Donaciones
CREATE TABLE donations (
    id VARCHAR(50) PRIMARY KEY,
    donor_id VARCHAR(50) NOT NULL REFERENCES donors(id) ON DELETE RESTRICT,
    donor_nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    medio_pago VARCHAR(50),
    monto DECIMAL(12, 2),
    items JSONB,
    descripcion TEXT,
    fondo_destino VARCHAR(50),
    event_id VARCHAR(50) REFERENCES events(id) ON DELETE SET NULL,
    comprobante_url TEXT,
    fecha DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Ítems de bolsa de suministros
CREATE TABLE supply_items (
    id VARCHAR(50) PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    cantidad_requerida INT NOT NULL,
    cantidad_cubierta INT NOT NULL DEFAULT 0,
    precio_unitario_estimado DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Transacciones Financieras (Kardex)
CREATE TABLE transactions (
    id VARCHAR(50) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    concepto TEXT NOT NULL,
    monto DECIMAL(12, 2) NOT NULL,
    fondo VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    donation_id VARCHAR(50) REFERENCES donations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla: Notificaciones
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    tipo VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security) y políticas si fuera necesario.
-- Por defecto, se asume que las tablas están en el esquema 'public'.

-- 4. INSERCIÓN DE DATOS MOCK

`;

  // Mype
  const mypeCols = ['id', 'razon_social', 'ruc', 'rubro', 'contacto', 'telefono', 'email', 'distrito', 'activo', 'historial_aportes', 'created_at'];
  sqlContent += generateInsert('mypes', mypeCols, MOCK_MYPES);

  // Organizations
  const orgCols = ['id', 'nombre', 'tipo', 'direccion', 'distrito', 'telefono', 'encargado', 'email', 'beneficiarios_estimados', 'necesidades', 'activo', 'created_at', 'updated_at'];
  sqlContent += generateInsert('organizations', orgCols, MOCK_ORGANIZATIONS);

  // Donors
  const donorCols = ['id', 'nombres', 'tipo', 'documento', 'telefono', 'email', 'distrito', 'mype_id', 'created_at'];
  sqlContent += generateInsert('donors', donorCols, MOCK_DONORS);

  // Events
  const eventCols = ['id', 'organization_id', 'organization_nombre', 'title', 'description', 'distrito', 'target_audience', 'start_time', 'end_time', 'status', 'coordinador_id', 'notes', 'created_at', 'updated_at'];
  sqlContent += generateInsert('events', eventCols, MOCK_EVENTS);

  // Donations
  const donationCols = ['id', 'donor_id', 'donor_nombre', 'tipo', 'medio_pago', 'monto', 'items', 'descripcion', 'fondo_destino', 'event_id', 'comprobante_url', 'fecha', 'created_at'];
  sqlContent += generateInsert('donations', donationCols, MOCK_DONATIONS);

  // Supply items
  const supplyCols = ['id', 'event_id', 'nombre', 'categoria', 'unidad', 'cantidad_requerida', 'cantidad_cubierta', 'precio_unitario_estimado', 'created_at'];
  sqlContent += generateInsert('supply_items', supplyCols, MOCK_SUPPLY_ITEMS);

  // Transactions
  const txCols = ['id', 'tipo', 'concepto', 'monto', 'fondo', 'fecha', 'donation_id', 'created_at'];
  sqlContent += generateInsert('transactions', txCols, MOCK_TRANSACTIONS);

  // Notifications
  const notifCols = ['id', 'user_id', 'tipo', 'title', 'message', 'read', 'data', 'created_at'];
  sqlContent += generateInsert('notifications', notifCols, MOCK_NOTIFICATIONS);

  const outputPath = path.join(__dirname, '..', 'supabase_seed.sql');
  fs.writeFileSync(outputPath, sqlContent, 'utf-8');
  console.log(`¡SQL generado con éxito en ${outputPath}!`);
}

main().catch(err => {
  console.error('Error al generar el script SQL:', err);
  process.exit(1);
});
