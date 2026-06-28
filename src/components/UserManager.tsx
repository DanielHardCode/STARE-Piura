import React, { useState, useEffect, useMemo } from 'react';
import { useUserManagement, UserFormData } from '@/hooks/useUserManagement';
import { UserForm } from './UserForm';
import { Search, Plus, Edit2, Mail, Phone, User as UserIcon } from 'lucide-react';
import { User, UserRole } from '@/types';

export const UserManager: React.FC = () => {
  const { users, isLoading, fetchUsers, createUser, updateUser, toggleUserStatus } = useUserManagement();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | undefined>();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setUserToEdit(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  };

  const handleSave = async (data: UserFormData) => {
    if (userToEdit) {
      await updateUser(userToEdit.id, data);
    } else {
      await createUser(data);
    }
    setIsFormOpen(false);
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'active' && user.activo) || 
        (filterStatus === 'inactive' && !user.activo);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const getRoleBadgeColor = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'coordinador': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
      case 'voluntario': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header y Acciones */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-900 dark:text-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 dark:text-slate-300"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value as UserRole | 'all')}
          >
            <option value="all">Todos los Roles</option>
            <option value="admin">Administradores</option>
            <option value="coordinador">Coordinadores</option>
            <option value="voluntario">Voluntarios</option>
          </select>
          <select 
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 dark:text-slate-300"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full md:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Registrar Usuario
        </button>
      </div>

      {/* Grid / Listado */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No se encontraron usuarios con esos filtros.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <UserIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{u.nombre}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: {u.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5" />
                          {u.email}
                        </div>
                        {u.telefono && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Phone className="w-3.5 h-3.5" />
                            {u.telefono}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border capitalize ${getRoleBadgeColor(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toggleUserStatus(u.id, u.activo)}
                        disabled={isLoading}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${u.activo ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        title={u.activo ? 'Desactivar' : 'Activar'}
                      >
                        <span className="sr-only">Cambiar estado</span>
                        <span aria-hidden="true" className={`pointer-events-none absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${u.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        title="Editar Perfil"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <UserForm
          userToEdit={userToEdit}
          onSave={handleSave}
          onClose={() => setIsFormOpen(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
