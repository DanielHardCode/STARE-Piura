import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types';

// Mock inicial
const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    nombre: 'Admin Central',
    email: 'admin@stare.pe',
    role: 'admin',
    telefono: '999888777',
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-2',
    nombre: 'Coordinador Piura',
    email: 'coordinador@stare.pe',
    role: 'coordinador',
    telefono: '912345678',
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-3',
    nombre: 'Voluntario Ruta',
    email: 'voluntario@stare.pe',
    role: 'voluntario',
    telefono: '998877665',
    activo: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-4',
    nombre: 'Inactivo Viejo',
    email: 'baja@stare.pe',
    role: 'voluntario',
    telefono: '900000001',
    activo: false,
    created_at: new Date().toISOString(),
  },
];

export interface UserFormData {
  nombre: string;
  email: string;
  telefono?: string;
  role: UserRole;
  password?: string; // Solo para frontend mock
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    // Simular fetch
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    const newUser: User = {
      id: `u-${Date.now()}`,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      role: data.role,
      activo: true,
      created_at: new Date().toISOString(),
    };
    
    setUsers(prev => [...prev, newUser]);
    setIsLoading(false);
    return newUser;
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<UserFormData> & { activo?: boolean }) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        return {
          ...u,
          ...data,
          id: u.id,
          created_at: u.created_at
        };
      }
      return u;
    }));
    
    setIsLoading(false);
  }, []);

  const toggleUserStatus = useCallback(async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, activo: !currentStatus } : u));
    setIsLoading(false);
  }, []);

  return {
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus
  };
}
