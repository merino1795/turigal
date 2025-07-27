// frontend/src/components/admin/sections/UserSection.tsx - ARCHIVO FINAL COMPLETO

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, UserPlus, Users, UserCheck, Shield, Loader2, 
  Search, X, Edit, Trash2, Key, Plus, Eye, Calendar,
  RefreshCw, AlertCircle, CheckCircle, XCircle
} from 'lucide-react';
import { User } from '../../../services/api';
import apiService from '../../../services/api';

interface UsersSectionProps {
  onTotalChange: (total: number) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({ onTotalChange }) => {
  // Estados principales
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Estados para filtros
  const [filters, setFilters] = useState({
    search: '',
    verified: '',
    role: '',
    from: '',
    to: ''
  });

  // Estados para operaciones
  const [isExporting, setIsExporting] = useState(false);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);

  // Función para recargar usuarios
  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      
      // Solo agregar filtros que tienen valor
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.verified) params.verified = filters.verified === 'true';
      if (filters.role) params.role = filters.role;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const response = await apiService.getUsers(params);
      if (response.success && response.data) {
        setUsers(response.data.users);
        setUsersTotal(response.data.total);
        onTotalChange(response.data.total);
      } else {
        console.error('Error en respuesta:', response.error);
        setUsers([]);
        setUsersTotal(0);
        onTotalChange(0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setUsersTotal(0);
      onTotalChange(0);
    } finally {
      setUsersLoading(false);
    }
  }, [filters, onTotalChange]);

  // Cargar usuarios al montar el componente y cuando cambien los filtros
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // Handlers para filtros
  const handleFilterChange = useCallback((field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      verified: '',
      role: '',
      from: '',
      to: ''
    });
  }, []);

  // Handlers para modales
  const openCreateModal = useCallback(() => setShowCreateModal(true), []);
  const closeCreateModal = useCallback(() => setShowCreateModal(false), []);

  const openEditModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  }, []);
  const closeEditModal = useCallback(() => {
    setSelectedUser(null);
    setShowEditModal(false);
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  }, []);
  const closeDeleteModal = useCallback(() => {
    setSelectedUser(null);
    setShowDeleteModal(false);
  }, []);

  const openPasswordModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowPasswordModal(true);
  }, []);
  const closePasswordModal = useCallback(() => {
    setSelectedUser(null);
    setShowPasswordModal(false);
  }, []);

  const openViewModal = useCallback((user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  }, []);
  const closeViewModal = useCallback(() => {
    setSelectedUser(null);
    setShowViewModal(false);
  }, []);

  // Handlers para acciones
  const handleCreateUser = useCallback(async (userData: any) => {
    setOperationLoading('create');
    try {
      const response = await apiService.createUser(userData);
      if (response.success) {
        closeCreateModal();
        alert('Usuario creado correctamente');
        await refreshUsers();
      } else {
        alert(response.error || 'Error al crear usuario');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error de conexión');
    } finally {
      setOperationLoading(null);
    }
  }, [refreshUsers]);

  const handleEditUser = useCallback(async (userData: any) => {
    if (!selectedUser) return;
    
    setOperationLoading('edit');
    try {
      const response = await apiService.updateUser(selectedUser.id, userData);
      if (response.success) {
        closeEditModal();
        alert('Usuario actualizado correctamente');
        await refreshUsers();
      } else {
        alert(response.error || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error de conexión');
    } finally {
      setOperationLoading(null);
    }
  }, [selectedUser, refreshUsers]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser) return;
    
    setOperationLoading('delete');
    try {
      const response = await apiService.deleteUser(selectedUser.id);
      if (response.success) {
        closeDeleteModal();
        alert('Usuario eliminado correctamente');
        await refreshUsers();
      } else {
        alert(response.error || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error de conexión');
    } finally {
      setOperationLoading(null);
    }
  }, [selectedUser, refreshUsers]);

  const handleChangePassword = useCallback(async (newPassword: string) => {
    if (!selectedUser) return;
    
    setOperationLoading('password');
    try {
      const response = await apiService.changeUserPassword(selectedUser.id, newPassword);
      if (response.success) {
        closePasswordModal();
        alert('Contraseña cambiada correctamente');
      } else {
        alert(response.error || 'Error al cambiar contraseña');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error de conexión');
    } finally {
      setOperationLoading(null);
    }
  }, [selectedUser]);

  const handleExportUsers = useCallback(async () => {
    setIsExporting(true);
    try {
      const params: any = {};
      
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.verified) params.verified = filters.verified === 'true';
      if (filters.role) params.role = filters.role;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const response = await apiService.exportUsers(params);
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Exportación completada');
      } else {
        alert('Error al exportar usuarios');
      }
    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Error de conexión');
    } finally {
      setIsExporting(false);
    }
  }, [filters]);

  // Comprobar si hay filtros activos
  const hasActiveFilters = Object.values(filters).some(filter => filter);

  // Calcular estadísticas
  const verifiedUsersCount = users.filter(u => u.isVerified).length;
  const adminUsersCount = users.filter(u => u.role === 'ADMIN').length;
  const ownerUsersCount = users.filter(u => u.role === 'OWNER').length;
  const regularUsersCount = users.filter(u => u.role === 'USER').length;

  // Función para traducir roles
  const translateRole = (role: string): string => {
    const translations: Record<string, string> = {
      'ADMIN': 'Administrador',
      'OWNER': 'Propietario',
      'USER': 'Usuario'
    };
    return translations[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <p className="text-gray-600 mt-1">
            {usersTotal} {usersTotal === 1 ? 'usuario' : 'usuarios'} 
            {hasActiveFilters && ' (filtrados)'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportUsers}
            disabled={usersLoading || isExporting}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </>
            )}
          </button>
          <button 
            onClick={refreshUsers}
            disabled={usersLoading}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${usersLoading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
          <button 
            onClick={openCreateModal}
            disabled={usersLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Nombre, email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                disabled={usersLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.value)}
              disabled={usersLoading}
            >
              <option value="">Todos los estados</option>
              <option value="true">Verificado</option>
              <option value="false">Sin verificar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              disabled={usersLoading}
            >
              <option value="">Todos los roles</option>
              <option value="ADMIN">Administrador</option>
              <option value="OWNER">Propietario</option>
              <option value="USER">Usuario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              disabled={usersLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
              disabled={usersLoading}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              disabled={usersLoading}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabla de usuarios */}
      {usersLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                    <th className="text-left p-4 font-medium text-gray-700">Rol</th>
                    <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-4 font-medium text-gray-700">Fecha Registro</th>
                    <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'OWNER' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {translateRole(user.role)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isVerified ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Verificado</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Sin verificar</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(user.createdAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openViewModal(user)}
                            className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openPasswordModal(user)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-50 rounded transition-colors"
                            title="Cambiar contraseña"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(user)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay usuarios</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'No se encontraron usuarios con los filtros aplicados.'
                  : 'Aún no se han registrado usuarios en el sistema.'
                }
              </p>
              {!hasActiveFilters && (
                <button 
                  onClick={openCreateModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Primer Usuario</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-800">{usersTotal}</p>
              <p className="text-blue-600 text-sm">En el sistema</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Verificados</p>
              <p className="text-3xl font-bold text-gray-800">{verifiedUsersCount}</p>
              <p className="text-green-600 text-sm">Activos</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Administradores</p>
              <p className="text-3xl font-bold text-gray-800">{adminUsersCount}</p>
              <p className="text-purple-600 text-sm">Con permisos</p>
            </div>
            <Shield className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Propietarios</p>
              <p className="text-3xl font-bold text-gray-800">{ownerUsersCount}</p>
              <p className="text-orange-600 text-sm">Gestores</p>
            </div>
            <Users className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Distribución por rol (solo si hay usuarios) */}
      {users.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Rol</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-800">{adminUsersCount}</p>
              <p className="text-sm text-purple-600">Administradores</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-800">{ownerUsersCount}</p>
              <p className="text-sm text-blue-600">Propietarios</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-800">{regularUsersCount}</p>
              <p className="text-sm text-green-600">Usuarios</p>
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      {showCreateModal && (
        <CreateUserModal 
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onSubmit={handleCreateUser}
          isLoading={operationLoading === 'create'}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal 
          isOpen={showEditModal}
          user={selectedUser}
          onClose={closeEditModal}
          onSubmit={handleEditUser}
          isLoading={operationLoading === 'edit'}
        />
      )}

      {showDeleteModal && selectedUser && (
        <DeleteUserModal 
          isOpen={showDeleteModal}
          user={selectedUser}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteUser}
          isLoading={operationLoading === 'delete'}
        />
      )}

      {showPasswordModal && selectedUser && (
        <ChangePasswordModal 
          isOpen={showPasswordModal}
          user={selectedUser}
          onClose={closePasswordModal}
          onSubmit={handleChangePassword}
          isLoading={operationLoading === 'password'}
        />
      )}

      {showViewModal && selectedUser && (
        <ViewUserModal 
          isOpen={showViewModal}
          user={selectedUser}
          onClose={closeViewModal}
        />
      )}
    </div>
  );
};

// ===== COMPONENTES DE MODALES =====

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  isLoading: boolean;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El email es obligatorio';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    await onSubmit({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input 
              type="text" 
              className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-300' : 'border-gray-300'}`}
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido *</label>
            <input 
              type="text" 
              className={`w-full px-3 py-2 border rounded-lg ${errors.lastName ? 'border-red-300' : 'border-gray-300'}`}
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input 
              type="email" 
              className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
            <input 
              type="password" 
              className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isLoading}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña *</label>
            <input 
              type="password" 
              className={`w-full px-3 py-2 border rounded-lg ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <span>Crear Usuario</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditUserModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSubmit: (userData: any) => Promise<void>;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Editar Usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.role}
              onChange={handleInputChange('role')}
              disabled={isLoading}
            >
              <option value="USER">Usuario</option>
              <option value="OWNER">Propietario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="isVerified"
              className="mr-2"
              checked={formData.isVerified}
              onChange={handleInputChange('isVerified')}
              disabled={isLoading}
            />
            <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">
              Usuario verificado
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ isOpen, user, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">Confirmar Eliminación</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            ¿Estás seguro de que deseas eliminar este usuario?
          </p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">Rol: {user.role}</p>
          </div>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">⚠️ Advertencia</p>
            <p className="text-sm text-red-600 mt-1">
              Esta acción no se puede deshacer y eliminará todos los datos asociados.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Usuario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSubmit: (newPassword: string) => Promise<void>;
  isLoading: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, user, onClose, onSubmit, isLoading }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    await onSubmit(password);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cambiar Contraseña</h3>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Usuario:</strong> {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-blue-600">{user.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              placeholder="Repetir contraseña"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center space-x-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cambiando...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Cambiar Contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ViewUserModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
}

const ViewUserModal: React.FC<ViewUserModalProps> = ({ isOpen, user, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Detalles del Usuario</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h4>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Rol</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                user.role === 'OWNER' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role === 'ADMIN' ? 'Administrador' : 
                 user.role === 'OWNER' ? 'Propietario' : 'Usuario'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.isVerified ? 'Verificado' : 'Sin verificar'}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Registro</label>
              <p className="text-sm text-gray-800">
                {new Date(user.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">ID</label>
              <p className="text-xs text-gray-600 font-mono">{user.id}</p>
            </div>
          </div>

          {user.updatedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Última Actualización</label>
              <p className="text-sm text-gray-800">
                {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;