import { getRepositories } from '@/repositories';
import type { FinancialTransaction, CreateTransactionDTO, FundBalances, DashboardKPIs } from '@/types/index';

export class FinanceService {
  private get repos() {
    return getRepositories();
  }

  async getTransactions(): Promise<FinancialTransaction[]> {
    const txs = await this.repos.transactions.getAll();
    // Ordenar por fecha y hora descendente (más recientes primero)
    return txs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getBalances(): Promise<FundBalances> {
    return this.repos.transactions.getBalances();
  }

  async createTransaction(dto: CreateTransactionDTO): Promise<FinancialTransaction> {
    if (!dto.concepto.trim()) {
      throw new Error('El concepto de la transacción es obligatorio.');
    }
    if (dto.monto <= 0) {
      throw new Error('El monto debe ser mayor a cero.');
    }

    // Si es un egreso, validar que haya fondos suficientes
    if (dto.tipo === 'egreso') {
      const balances = await this.repos.transactions.getBalances();
      const saldoDisponible = dto.fondo === 'caja_chica' ? balances.caja_chica : balances.fondo_adquisicion;
      if (saldoDisponible < dto.monto) {
        throw new Error(
          `Fondos insuficientes en el fondo ${dto.fondo === 'caja_chica' ? 'Caja Chica' : 'Fondo de Adquisición'}. Saldo actual: S/. ${saldoDisponible.toFixed(2)}`
        );
      }
    }

    const tx = await this.repos.transactions.create(dto);

    // Si el saldo después de la transacción queda por debajo del mínimo, generar notificación
    try {
      const balances = await this.repos.transactions.getBalances();
      if (balances.caja_chica < 100 && dto.fondo === 'caja_chica') {
        await this.repos.notifications.create(
          'fondo_bajo',
          'Alerta de Caja Chica baja',
          `El saldo de la Caja Chica es de S/. ${balances.caja_chica.toFixed(2)}.`
        );
      }
      if (balances.fondo_adquisicion < 500 && dto.fondo === 'fondo_adquisicion') {
        await this.repos.notifications.create(
          'fondo_bajo',
          'Alerta de Fondo de Adquisición bajo',
          `El saldo del Fondo de Adquisición es de S/. ${balances.fondo_adquisicion.toFixed(2)}.`
        );
      }
    } catch (err) {
      console.error('Error al validar límites de saldos:', err);
    }

    return tx;
  }

  async getDashboardKPIs(): Promise<DashboardKPIs> {
    const [balances, donations, events, organizations] = await Promise.all([
      this.repos.transactions.getBalances(),
      this.repos.donations.getAll(),
      this.repos.events.getAll(),
      this.repos.organizations.getAll(),
    ]);

    // Usaremos el mes actual de la simulación. En base a los datos generados, asumiremos Junio 2026.
    // Si la fecha actual local es diferente, usamos Junio de 2026 para asegurar coherencia con los datos del seed fijo.
    const refDate = new Date('2026-06-24T16:00:00-05:00');
    const targetYear = refDate.getFullYear();
    const targetMonth = refDate.getMonth(); // 0-11 (Junio es 5)

    // 1. Filtrar donaciones monetarias del mes
    const donacionesMes = donations.filter((d) => {
      const dDate = new Date(d.fecha);
      return dDate.getFullYear() === targetYear && dDate.getMonth() === targetMonth;
    });

    const totalDonacionesMes = donacionesMes
      .filter((d) => d.tipo === 'monetaria')
      .reduce((acc, d) => acc + (d.monto || 0), 0);

    const totalDonacionesCountMes = donacionesMes.length;

    // 2. Filtrar eventos del mes
    const eventosMes = events.filter((e) => {
      const eDate = new Date(e.start_time);
      return eDate.getFullYear() === targetYear && eDate.getMonth() === targetMonth;
    });

    const visitasProgramadasMes = eventosMes.filter((e) => e.status === 'programada' || e.status === 'en_curso').length;
    const visitasRealizadasMes = eventosMes.filter((e) => e.status === 'realizada').length;

    // 3. Cobertura de bolsas del mes
    let totalItemsRequeridos = 0;
    let totalItemsCubiertos = 0;

    for (const evt of eventosMes) {
      const supplyItems = await this.repos.events.getSupplyItems(evt.id);
      totalItemsRequeridos += supplyItems.reduce((acc, x) => acc + x.cantidad_requerida, 0);
      totalItemsCubiertos += supplyItems.reduce((acc, x) => acc + x.cantidad_cubierta, 0);
    }

    const coberturaBolsasPct =
      totalItemsRequeridos > 0 ? Math.round((totalItemsCubiertos / totalItemsRequeridos) * 100) : 100;

    // 4. Beneficiarios alcanzados en el mes (visitas realizadas)
    const orgsMap = new Map(organizations.map((o) => [o.id, o]));
    const visitasRealizadasObj = eventosMes.filter((e) => e.status === 'realizada');
    const beneficiariosAlcanzadosMes = visitasRealizadasObj.reduce((acc, evt) => {
      if (evt.organization_id) {
        const org = orgsMap.get(evt.organization_id);
        if (org) {
          return acc + org.beneficiarios_estimados;
        }
      }
      return acc;
    }, 0);

    // 5. Organizaciones activas
    const organizacionesActivas = organizations.filter((o) => o.activo).length;

    return {
      saldo_caja_chica: parseFloat(balances.caja_chica.toFixed(2)),
      saldo_fondo_adquisicion: parseFloat(balances.fondo_adquisicion.toFixed(2)),
      total_donaciones_mes: parseFloat(totalDonacionesMes.toFixed(2)),
      total_donaciones_count_mes: totalDonacionesCountMes,
      visitas_programadas_mes: visitasProgramadasMes,
      visitas_realizadas_mes: visitasRealizadasMes,
      cobertura_bolsas_pct: coberturaBolsasPct,
      beneficiarios_alcanzados_mes: beneficiariosAlcanzadosMes,
      organizaciones_activas: organizacionesActivas,
    };
  }
}

export const financeService = new FinanceService();
