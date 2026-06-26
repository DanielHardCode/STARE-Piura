import React, { useState, useEffect } from 'react';
import { X, Save, Lock, Shield, User as UserIcon, Phone, Mail } from 'lucide-react';
import { User, UserRole } from '@/types';
import { UserFormData } from '@/hooks/useUserManagement';

interface UserFormProps {
  userToEdit?: User;
  onSave: (data: UserFormData) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  userToEdit,
  onSave,
  onClose,
  isLoading
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    nombre: '',
    email: '',
    telefono: '',
    role: 'voluntario',
    password: ''
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        nombre: userToEdit.nombre,
        email: userToEdit.email,
        telefono: userToEdit.telefono || '',
        role: userToEdit.role,
        password: '' // Vacio intencionalmente
      });
    }
  }, [userToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const isEditing = !!userToEdit;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre Completo</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                placeholder="Ej. Juan Pérez"
                value={formData.nombre}
                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                placeholder="ejemplo@stare.pe"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Teléfono (Opcional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                placeholder="999 888 777"
                value={formData.telefono}
                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rol de Acceso</label>
            <select
              required
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value="voluntario">Voluntario</option>
              <option value="coordinador">Coordinador</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña Inicial'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required={!isEditing}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 outline-none text-slate-900 dark:text-white"
                placeholder={isEditing ? "Dejar en blanco para no cambiar" : "Mínimo 8 caracteres"}
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg shadow flex items-center gap-2 transition-colors disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Guardando...' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
