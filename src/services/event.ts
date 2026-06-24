import { getRepositories } from '@/repositories';
import type {
  Event,
  CreateEventDTO,
  UpdateEventDTO,
  SupplyItem,
  CreateSupplyItemDTO,
  UpdateSupplyItemDTO,
  EventWithBolsa
} from '@/types/index';

export class EventService {
  private get repos() {
    return getRepositories();
  }

  private enrichEvent(evt: Event, allSupplyItems: SupplyItem[]): EventWithBolsa {
    const items = allSupplyItems.filter((x) => x.event_id === evt.id);
    const totalRequeridos = items.reduce((acc, x) => acc + x.cantidad_requerida, 0);
    const totalCubiertos = items.reduce((acc, x) => acc + x.cantidad_cubierta, 0);

    const cobertura_pct = totalRequeridos > 0 ? Math.round((totalCubiertos / totalRequeridos) * 100) : 100;
    const items_faltantes = items.reduce(
      (acc, x) => acc + Math.max(0, x.cantidad_requerida - x.cantidad_cubierta),
      0
    );

    const costo_estimado_brecha = items.reduce((acc, x) => {
      const brecha = Math.max(0, x.cantidad_requerida - x.cantidad_cubierta);
      return acc + brecha * x.precio_unitario_estimado;
    }, 0);

    return {
      ...evt,
      supply_items: items,
      cobertura_pct,
      items_faltantes,
      costo_estimado_brecha: parseFloat(costo_estimado_brecha.toFixed(2)),
    };
  }

  async getEvents(): Promise<EventWithBolsa[]> {
    const evts = await this.repos.events.getAll();
    // Para no hacer N llamadas, obtenemos todos los items de bolsa (o mock lo hace rápido)
    // En una base de datos real, esto se haría mediante un JOIN.
    // Aquí, para mantener el repositorio limpio, mapamos:
    const enriched = await Promise.all(
      evts.map(async (evt) => {
        const items = await this.repos.events.getSupplyItems(evt.id);
        return this.enrichEvent(evt, items);
      })
    );
    // Ordenar por fecha de inicio (más recientes o futuras primero)
    return enriched.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }

  async getEventById(id: string): Promise<EventWithBolsa | null> {
    const evt = await this.repos.events.getById(id);
    if (!evt) return null;
    const items = await this.repos.events.getSupplyItems(id);
    return this.enrichEvent(evt, items);
  }

  async createEvent(dto: CreateEventDTO): Promise<EventWithBolsa> {
    if (!dto.title.trim()) {
      throw new Error('El título del evento es obligatorio.');
    }
    if (!dto.start_time || !dto.end_time) {
      throw new Error('Las horas de inicio y fin son obligatorias.');
    }
    if (new Date(dto.start_time) >= new Date(dto.end_time)) {
      throw new Error('La hora de inicio debe ser anterior a la hora de fin.');
    }

    const newEvt = await this.repos.events.create(dto);
    
    // Crear notificación de visita programada
    try {
      await this.repos.notifications.create(
        'visita_proxima',
        'Nueva visita programada',
        `Se ha programado la visita "${dto.title}" para el ${new Date(dto.start_time).toLocaleDateString('es-PE')}.`
      );
    } catch (err) {
      console.error('Error al notificar creación de evento:', err);
    }

    return this.enrichEvent(newEvt, []);
  }

  async updateEvent(id: string, dto: UpdateEventDTO): Promise<EventWithBolsa> {
    const updatedEvt = await this.repos.events.update(id, dto);
    const items = await this.repos.events.getSupplyItems(id);

    // Si se cancela el evento, notificar al sistema
    if (dto.status === 'cancelada') {
      try {
        await this.repos.notifications.create(
          'evento_actualizado',
          'Visita cancelada',
          `La visita "${updatedEvt.title}" ha sido cancelada.`
        );
      } catch (err) {
        console.error(err);
      }
    }

    return this.enrichEvent(updatedEvt, items);
  }

  async getSupplyItems(eventId: string): Promise<SupplyItem[]> {
    return this.repos.events.getSupplyItems(eventId);
  }

  async createSupplyItem(dto: CreateSupplyItemDTO): Promise<SupplyItem> {
    if (!dto.nombre.trim()) {
      throw new Error('El nombre del ítem es obligatorio.');
    }
    if (dto.cantidad_requerida <= 0) {
      throw new Error('La cantidad requerida debe ser mayor a cero.');
    }
    const item = await this.repos.events.createSupplyItem(dto);
    
    // Verificar si el evento ahora tiene una baja cobertura y notificar si es necesario
    this.checkAndNotifyLowCoverage(dto.event_id);

    return item;
  }

  async updateSupplyItem(itemId: string, dto: UpdateSupplyItemDTO): Promise<SupplyItem> {
    const item = await this.repos.events.updateSupplyItem(itemId, dto);
    
    // Verificar cobertura del evento
    this.checkAndNotifyLowCoverage(item.event_id);

    return item;
  }

  private async checkAndNotifyLowCoverage(eventId: string): Promise<void> {
    try {
      const evt = await this.repos.events.getById(eventId);
      if (!evt) return;
      const items = await this.repos.events.getSupplyItems(eventId);
      const totalRequeridos = items.reduce((acc, x) => acc + x.cantidad_requerida, 0);
      const totalCubiertos = items.reduce((acc, x) => acc + x.cantidad_cubierta, 0);
      const cobertura = totalRequeridos > 0 ? (totalCubiertos / totalRequeridos) * 100 : 100;

      if (cobertura < 50 && items.length > 0 && evt.status === 'programada') {
        // Buscar si ya hay alerta de bolsa incompleta reciente para evitar duplicar
        const notifs = await this.repos.notifications.getAll();
        const yaExiste = notifs.some(
          (n) => n.tipo === 'bolsa_incompleta' && n.message.includes(evt.title) && !n.read
        );

        if (!yaExiste) {
          await this.repos.notifications.create(
            'bolsa_incompleta',
            'Bolsa de suministros con baja cobertura',
            `La visita "${evt.title}" tiene una cobertura de suministros del ${Math.round(cobertura)}%.`
          );
        }
      }
    } catch (err) {
      console.error('Error al validar cobertura para notificaciones:', err);
    }
  }
}

export const eventService = new EventService();
