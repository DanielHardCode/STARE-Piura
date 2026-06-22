/**
 * @file events.seed.ts
 * @description Datos iniciales de eventos sociales para desarrollo y demostración.
 * En producción, estos datos deberían venir de una API o base de datos.
 */
import { SocialEvent } from '../types/event.types';

export const INITIAL_EVENTS: SocialEvent[] = [
  {
    id: 'ev-1',
    title: 'Apoyo Nutricional PRONOEI "Corazoncitos de Jesús"',
    description: 'Entrega de desayunos fortificados y útiles educativos a niños de inicial en asentamientos humanos de Catacaos.',
    date: '2026-06-15',
    district: 'Catacaos',
    targetAudience: '45 niños de 3 a 5 años (Zonas rurales de inundación)',
    status: 'programado',
    itemsBolsa: [
      { id: 'bi-1', name: 'Leche evaporada entera', unit: 'tarros de 170g', targetQty: 90, currentQty: 35, unitPriceEstimate: 4.20 },
      { id: 'bi-2', name: 'Galletas nutritivas de Quinua', unit: 'paquetes ind.', targetQty: 120, currentQty: 45, unitPriceEstimate: 1.50 },
      { id: 'bi-3', name: 'Cuadernos cuadriculados A4', unit: 'unidades', targetQty: 45, currentQty: 45, unitPriceEstimate: 5.00 },
      { id: 'bi-4', name: 'Jabón líquido antiséptico', unit: 'frascos de 400ml', targetQty: 15, currentQty: 5, unitPriceEstimate: 8.50 },
    ],
  },
  {
    id: 'ev-2',
    title: 'Campaña contra el Friaje y Anemia en Locuto',
    description: 'Distribución urgente de abrigos y raciones proteicas en comunidades secas del Alto Tambogrande.',
    date: '2026-06-08',
    district: 'Tambogrande',
    targetAudience: '70 familias de bajos recursos y madres lactantes',
    status: 'programado',
    itemsBolsa: [
      { id: 'bi-5', name: 'Mantas térmicas polares', unit: 'unidades', targetQty: 70, currentQty: 25, unitPriceEstimate: 15.00 },
      { id: 'bi-6', name: 'Conservas de Jurel en salsa de tomate', unit: 'latas de 425g', targetQty: 140, currentQty: 38, unitPriceEstimate: 5.50 },
      { id: 'bi-7', name: 'Avena reforzada con Hierro', unit: 'bolsas de 1kg', targetQty: 30, currentQty: 10, unitPriceEstimate: 7.00 },
    ],
  },
  {
    id: 'ev-3',
    title: 'Compartir Solidario en Asilo "Hermanitas de los Desamparados"',
    description: 'Atención recreativa y entrega de kits geriátricos en Piura Centro.',
    date: '2026-06-28',
    district: 'Piura Centro',
    targetAudience: '36 adultos mayores internados de extrema pobreza',
    status: 'programado',
    itemsBolsa: [
      { id: 'bi-8', name: 'Pañales anatómicos para adulto G', unit: 'paquetes de 10 u.', targetQty: 12, currentQty: 8, unitPriceEstimate: 28.00 },
      { id: 'bi-9', name: 'Toallitas húmedas dermo-limpiadoras', unit: 'paquetes de 80 u.', targetQty: 24, currentQty: 12, unitPriceEstimate: 9.50 },
      { id: 'bi-10', name: 'Leche Ensure Clinical Formula', unit: 'latas de 400g', targetQty: 20, currentQty: 10, unitPriceEstimate: 62.00 },
    ],
  },
  {
    id: 'ev-4',
    title: 'Apoyo Alimentario en Olla Común "Santa Rosa" de Chulucanas',
    description: 'Gestión de insumos básicos para raciones de almuerzos debido al incremento estacional del costo de vida.',
    date: '2026-06-21',
    district: 'Chulucanas',
    targetAudience: '110 beneficiarios de la Olla Común zonal',
    status: 'programado',
    itemsBolsa: [
      { id: 'bi-11', name: 'Arroz extra de grano largo', unit: 'sacos de 50kg', targetQty: 3, currentQty: 1.5, unitPriceEstimate: 165.00 },
      { id: 'bi-12', name: 'Aceite vegetal comestible', unit: 'botellas de 1L', targetQty: 30, currentQty: 12, unitPriceEstimate: 7.80 },
      { id: 'bi-13', name: 'Lenteja de grano entero', unit: 'bolsas de 5kg', targetQty: 10, currentQty: 8, unitPriceEstimate: 22.00 },
    ],
  },
];
