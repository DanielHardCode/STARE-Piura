/**
 * @file src/repositories/mock/user.ts
 * @description Implementación mock del repositorio de Gestión de Usuarios.
 * Usa datos en memoria que coinciden con los usuarios de prueba del sistema.
 */

import type { IUserRepository } from '../contracts/user';
import type { User, RegisterUserDTO, UpdateUserDTO } from '@/types/index';
import { delay } from './utils';

const MOCK_USERS: User[] = [
  {
    id: 'u-admin-001',
    email: 'admin@stare.pe',
    nombre: 'Admin Central',
    role: 'admin',
    telefono: '999888777',
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-coord-001',
    email: 'coordinador@stare.pe',
    nombre: 'Coordinador Piura',
    role: 'coordinador',
    telefono: '912345678',
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-vol-001',
    email: 'voluntario@stare.pe',
    nombre: 'Voluntario Ruta Norte',
    role: 'voluntario',
    telefono: '998877665',
    activo: true,
    created_at: new Date().toISOString(),
  },
];

export class MockUserRepository implements IUserRepository {
  private static items: User[] = [...MOCK_USERS];

  async getAll(): Promise<User[]> {
    await delay();
    return [...MockUserRepository.items.map((x) => ({ ...x }))];
  }

  async getById(id: string): Promise<User | null> {
    await delay();
    const item = MockUserRepository.items.find((x) => x.id === id);
    return item ? { ...item } : null;
  }

  async register(dto: RegisterUserDTO): Promise<User> {
    await delay();
    const existingEmail = MockUserRepository.items.find((u) => u.email === dto.email);
    if (existingEmail) {
      throw new Error(`El correo ${dto.email} ya está registrado en el sistema.`);
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      email: dto.email,
      nombre: dto.nombre,
      role: dto.role,
      telefono: dto.telefono,
      activo: true,
      created_at: new Date().toISOString(),
    };
    MockUserRepository.items.push(newUser);
    return { ...newUser };
  }

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    await delay();
    const idx = MockUserRepository.items.findIndex((x) => x.id === id);
    if (idx === -1) {
      throw new Error(`Usuario con id ${id} no encontrado`);
    }
    const updated: User = { ...MockUserRepository.items[idx], ...dto };
    MockUserRepository.items[idx] = updated;
    return { ...updated };
  }
}
