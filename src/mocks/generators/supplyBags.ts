/**
 * @file src/mocks/generators/supplyBags.ts
 * @description Genera bolsas de suministros para cada evento (promedio 8 ítems/evento).
 */

import { f } from '../seed';
import type { SupplyItem, SupplyCategory } from '@/types/index';
import { MOCK_EVENTS } from './events';

const ITEM_TEMPLATES: Array<{ nombre: string; categoria: SupplyCategory; unidad: string; precio_min: number; precio_max: number }> = [
  // Víveres
  { nombre: 'Arroz extra (saco 50kg)', categoria: 'viveres', unidad: 'sacos', precio_min: 155, precio_max: 175 },
  { nombre: 'Aceite vegetal 1L', categoria: 'viveres', unidad: 'botellas', precio_min: 7, precio_max: 9 },
  { nombre: 'Leche evaporada Gloria 170g', categoria: 'viveres', unidad: 'tarros', precio_min: 3.8, precio_max: 4.5 },
  { nombre: 'Frijoles de palo 1kg', categoria: 'viveres', unidad: 'bolsas', precio_min: 6, precio_max: 9 },
  { nombre: 'Lenteja entera 1kg', categoria: 'viveres', unidad: 'bolsas', precio_min: 4.5, precio_max: 6.5 },
  { nombre: 'Avena Quaker 200g', categoria: 'viveres', unidad: 'bolsas', precio_min: 2.8, precio_max: 3.5 },
  { nombre: 'Conservas de Jurel 425g', categoria: 'viveres', unidad: 'latas', precio_min: 5, precio_max: 6.5 },
  { nombre: 'Galletas Soda Ritz', categoria: 'viveres', unidad: 'paquetes', precio_min: 2.5, precio_max: 3.5 },
  { nombre: 'Azúcar rubia 1kg', categoria: 'viveres', unidad: 'bolsas', precio_min: 3.5, precio_max: 4.5 },
  { nombre: 'Sal de mesa 1kg', categoria: 'viveres', unidad: 'bolsas', precio_min: 1.2, precio_max: 1.8 },
  // Medicina
  { nombre: 'Suero oral Pedialyte', categoria: 'medicina', unidad: 'sobres', precio_min: 1.5, precio_max: 2.5 },
  { nombre: 'Paracetamol 500mg', categoria: 'medicina', unidad: 'cajas x20', precio_min: 3, precio_max: 4.5 },
  { nombre: 'Sulfato ferroso pediátrico', categoria: 'medicina', unidad: 'frascos', precio_min: 8, precio_max: 12 },
  { nombre: 'Vitamina C 500mg', categoria: 'medicina', unidad: 'frascos x30', precio_min: 10, precio_max: 15 },
  { nombre: 'Alcohol gel antiséptico 500ml', categoria: 'medicina', unidad: 'frascos', precio_min: 9, precio_max: 13 },
  // Abrigo
  { nombre: 'Manta polar térmica', categoria: 'abrigo', unidad: 'unidades', precio_min: 18, precio_max: 28 },
  { nombre: 'Chompa de polar adulto', categoria: 'abrigo', unidad: 'unidades', precio_min: 25, precio_max: 45 },
  { nombre: 'Medias de lana', categoria: 'abrigo', unidad: 'pares', precio_min: 4, precio_max: 7 },
  // Limpieza
  { nombre: 'Jabón antibacterial 100g', categoria: 'limpieza', unidad: 'unidades', precio_min: 2, precio_max: 3 },
  { nombre: 'Detergente Ariel 1kg', categoria: 'limpieza', unidad: 'bolsas', precio_min: 9, precio_max: 12 },
  { nombre: 'Lejía 750ml', categoria: 'limpieza', unidad: 'botellas', precio_min: 3, precio_max: 4.5 },
  { nombre: 'Papel higiénico x4', categoria: 'limpieza', unidad: 'paquetes', precio_min: 6, precio_max: 9 },
  // Educación
  { nombre: 'Cuadernos cuadriculados A4', categoria: 'educacion', unidad: 'unidades', precio_min: 3.5, precio_max: 5.5 },
  { nombre: 'Lápices x12 Faber Castell', categoria: 'educacion', unidad: 'cajas', precio_min: 6, precio_max: 9 },
  { nombre: 'Colores x12', categoria: 'educacion', unidad: 'cajas', precio_min: 5, precio_max: 8 },
];

let supplyCounter = 1;

function generateSupplyItemsForEvent(eventId: string): SupplyItem[] {
  const count = f.number.int({ min: 5, max: 12 });
  const selectedTemplates = f.helpers.arrayElements(ITEM_TEMPLATES, count);

  return selectedTemplates.map((tpl) => {
    const n = supplyCounter++;
    const cantidad_requerida = f.number.int({ min: 10, max: 150 });
    const cobertura_pct = f.number.float({ min: 0.1, max: 1.0, fractionDigits: 2 });
    const cantidad_cubierta = Math.round(cantidad_requerida * cobertura_pct);

    return {
      id: `supply-${String(n).padStart(4, '0')}`,
      event_id: eventId,
      nombre: tpl.nombre,
      categoria: tpl.categoria,
      unidad: tpl.unidad,
      cantidad_requerida,
      cantidad_cubierta,
      precio_unitario_estimado: f.number.float({ min: tpl.precio_min, max: tpl.precio_max, fractionDigits: 2 }),
      created_at: new Date().toISOString(),
    };
  });
}

/** Bolsas de suministros para todos los eventos. */
export const MOCK_SUPPLY_ITEMS: SupplyItem[] = MOCK_EVENTS.flatMap((evt) =>
  generateSupplyItemsForEvent(evt.id)
);

/** Obtiene los ítems de un evento específico. */
export function getSupplyItemsByEvent(eventId: string): SupplyItem[] {
  return MOCK_SUPPLY_ITEMS.filter((item) => item.event_id === eventId);
}
