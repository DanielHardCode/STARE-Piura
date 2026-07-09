import type { SupplyBag, CreateSupplyBagDTO, UpdateSupplyBagDTO } from '@/types/index';

/**
 * Contrato del repositorio de Bolsas de Suministros.
 * Corresponde a los endpoints `/api/supply-bags`.
 */
export interface ISupplyBagRepository {
  /** GET /api/supply-bags */
  getAll(): Promise<SupplyBag[]>;
  /** GET /api/supply-bags/{id} */
  getById(id: string): Promise<SupplyBag | null>;
  /** POST /api/supply-bags */
  create(dto: CreateSupplyBagDTO): Promise<SupplyBag>;
  /** PUT /api/supply-bags/{id} */
  update(id: string, dto: UpdateSupplyBagDTO): Promise<SupplyBag>;
}
