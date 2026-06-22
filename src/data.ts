import { SocialEvent, MicroDonation, BalanceMovement, FundBalances, MypeProfile } from './types';

export const INITIAL_MYPES: MypeProfile[] = [
  {
    id: 'mype-1',
    name: 'Bodega "La Capullana"',
    ruc: '10452367412',
    phone: '968532145',
    district: 'Castilla',
    category: 'Bodega',
    contactPerson: 'Sra. Juana Capullana',
    registeredAt: '2026-06-01'
  },
  {
    id: 'mype-2',
    name: 'Panificadora de Chulucanas "Don Bosco"',
    ruc: '20452399124',
    phone: '955321478',
    district: 'Chulucanas',
    category: 'Panadería',
    contactPerson: 'Don Bosco Chulucanas',
    registeredAt: '2026-06-02'
  },
  {
    id: 'mype-3',
    name: 'Farmacia "Piura Medic"',
    ruc: '20124578963',
    phone: '978512356',
    district: 'Piura Centro',
    category: 'Farmacia',
    contactPerson: 'Dr. Alejandro Piura',
    registeredAt: '2026-06-02'
  }
];

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
    date: '2026-06-08', // Highly urgent, 5 days from June 3
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

export const INITIAL_DONATIONS: MicroDonation[] = [
  {
    id: 'don-1',
    mypeName: 'Bodega "La Capullana"',
    mypeCategory: 'Bodega',
    district: 'Castilla',
    date: '2026-06-01',
    method: 'Especie',
    itemsDonated: [
      { itemName: 'Leche evaporada entera', qty: 15 },
    ],
    eventId: 'ev-1',
    comment: 'Apoyo con mucho cariño de nuestros clientes constantes del asentamiento de El Indio.',
  },
  {
    id: 'don-2',
    mypeName: 'Panificadora de Chulucanas "Don Bosco"',
    mypeCategory: 'Panadería',
    district: 'Chulucanas',
    date: '2026-06-02',
    method: 'Yape',
    amount: 180,
    eventId: 'ev-4',
    comment: 'Microdonación por ventas del fin de semana.',
  },
  {
    id: 'don-3',
    mypeName: 'Farmacia "Piura Medic"',
    mypeCategory: 'Farmacia',
    district: 'Piura Centro',
    date: '2026-06-02',
    method: 'Especie',
    itemsDonated: [
      { itemName: 'Pañales anatómicos para adulto G', qty: 5 },
      { itemName: 'Toallitas húmedas dermo-limpiadoras', qty: 8 },
    ],
    eventId: 'ev-3',
    comment: 'Queremos sumarnos para la atención de nuestros abuelitos.',
  }
];

export const INITIAL_MOVEMENTS: BalanceMovement[] = [
  {
    id: 'mov-1',
    amount: 180.00,
    type: 'ingreso',
    fund: 'fondo_adquisicion',
    description: 'Donación digital vía Yape de Panificadora Don Bosco',
    date: '2026-06-02',
    method: 'Yape'
  },
  {
    id: 'mov-2',
    amount: 120.00,
    type: 'egreso',
    fund: 'caja_chica',
    description: 'Pago de combustible y flete de Mototaxi de Piura a Catacaos para traslado de donativos',
    date: '2026-06-02',
    method: 'Efectivo'
  },
  {
    id: 'mov-3',
    amount: 50.00,
    type: 'egreso',
    fund: 'caja_chica',
    description: 'Útiles de oficina y fotocopias de fichas de control de beneficiarios',
    date: '2026-06-01',
    method: 'Efectivo'
  }
];

export const INITIAL_BALANCES: FundBalances = {
  cajaChica: 430.00,       // local logistics and transport
  fondoAdquisicion: 1480.00, // directly buying missing materials
};
