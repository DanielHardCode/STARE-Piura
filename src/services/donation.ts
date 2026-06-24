import { getRepositories } from '@/repositories';
import type { Donation, CreateDonationDTO, UpdateDonationDTO, Donor, CreateDonorDTO } from '@/types/index';

export class DonationService {
  private get repos() {
    return getRepositories();
  }

  // ─── Donors ─────────────────────────────────────────────────────────────────
  async getDonors(): Promise<Donor[]> {
    return this.repos.donors.getAll();
  }

  async getDonorById(id: string): Promise<Donor | null> {
    return this.repos.donors.getById(id);
  }

  async createDonor(dto: CreateDonorDTO): Promise<Donor> {
    if (!dto.nombres.trim()) {
      throw new Error('El nombre o razón social del donante es obligatorio.');
    }
    if (!dto.documento.trim()) {
      throw new Error('El número de documento (DNI/RUC) es obligatorio.');
    }
    return this.repos.donors.create(dto);
  }

  // ─── Donations ──────────────────────────────────────────────────────────────
  async getDonations(): Promise<Donation[]> {
    return this.repos.donations.getAll();
  }

  async getDonationById(id: string): Promise<Donation | null> {
    return this.repos.donations.getById(id);
  }

  async getDonationsByEvent(eventId: string): Promise<Donation[]> {
    return this.repos.donations.getByEventId(eventId);
  }

  async createDonation(dto: CreateDonationDTO): Promise<Donation> {
    if (dto.tipo === 'monetaria') {
      if (!dto.monto || dto.monto <= 0) {
        throw new Error('El monto de la donación debe ser mayor a cero.');
      }
      if (!dto.medio_pago) {
        throw new Error('El medio de pago es obligatorio para donaciones monetarias.');
      }
      if (!dto.fondo_destino) {
        throw new Error('El fondo de destino es obligatorio para donaciones monetarias.');
      }
    } else {
      if (!dto.items || dto.items.length === 0) {
        throw new Error('Debe agregar al menos un ítem para donaciones en especie.');
      }
      dto.items.forEach((item) => {
        if (!item.item_nombre.trim() || item.cantidad <= 0) {
          throw new Error('Cada ítem de la donación en especie debe tener un nombre y una cantidad válida.');
        }
      });
    }

    // 1. Guardar la donación en el repositorio
    const newDonation = await this.repos.donations.create(dto);

    // 2. Si es monetaria, registrar transacción en el Kardex
    if (dto.tipo === 'monetaria') {
      await this.repos.transactions.create({
        tipo: 'ingreso',
        concepto: `Donación recibida de ${dto.donor_nombre} (${dto.medio_pago?.toUpperCase()})`,
        monto: dto.monto!,
        fondo: dto.fondo_destino!,
        donation_id: newDonation.id,
        fecha: dto.fecha || new Date().toISOString().split('T')[0],
      });

      // 3. Si el donante está vinculado a una MYPE, actualizar el historial de aportes de la MYPE
      try {
        const donor = await this.repos.donors.getById(dto.donor_id);
        if (donor && donor.mype_id) {
          const mype = await this.repos.mypes.getById(donor.mype_id);
          if (mype) {
            const nuevoAporte = (mype.historial_aportes || 0) + dto.monto!;
            await this.repos.mypes.update(mype.id, {
              historial_aportes: nuevoAporte,
            });
          }
        }
      } catch (err) {
        console.error('Error al actualizar historial de aportes de la MYPE vinculada:', err);
      }
    }

    // 4. Crear una notificación en el sistema
    try {
      const msj = dto.tipo === 'monetaria'
        ? `Se registró un ingreso de S/. ${dto.monto?.toFixed(2)} de ${dto.donor_nombre}.`
        : `Se recibió una donación en especie con ${dto.items?.length} tipos de ítems de ${dto.donor_nombre}.`;

      await this.repos.notifications.create(
        'donacion_recibida',
        'Nueva donación registrada',
        msj
      );
    } catch (err) {
      console.error('Error al crear notificación de donación:', err);
    }

    return newDonation;
  }

  async updateDonation(id: string, dto: UpdateDonationDTO): Promise<Donation> {
    return this.repos.donations.update(id, dto);
  }
}

export const donationService = new DonationService();
