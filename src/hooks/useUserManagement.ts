import { useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { apiFetch } from '@/lib/api-client';
import { isMockMode } from '@/lib/config';

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
  password?: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>(isMockMode ? INITIAL_USERS : []);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 600));
      } else {
        const data = await apiFetch<User[]>('/users');
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    setIsLoading(true);
    try {
      if (isMockMode) {
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
      }

      const newUser = await apiFetch<User>('/users/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setUsers(prev => [...prev, newUser]);
      setIsLoading(false);
      return newUser;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<UserFormData> & { activo?: boolean }) => {
    setIsLoading(true);
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 800));
        setUsers(prev => prev.map(u => {
          if (u.id === id) {
            return { ...u, ...data, id: u.id, created_at: u.created_at };
          }
          return u;
        }));
        setIsLoading(false);
        return;
      }

      const updatedUser = await apiFetch<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedUser } : u));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const toggleUserStatus = useCallback(async (id: string, currentStatus: boolean) => {
    setIsLoading(true);
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 400));
        setUsers(prev => prev.map(u => u.id === id ? { ...u, activo: !currentStatus } : u));
        setIsLoading(false);
        return;
      }

      await apiFetch<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ activo: !currentStatus }),
      });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, activo: !currentStatus } : u));
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
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