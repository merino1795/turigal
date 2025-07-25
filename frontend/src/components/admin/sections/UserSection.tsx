// src/components/admin/sections/UsersSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Download, UserPlus, Users, UserCheck, Shield, Loader2 } from 'lucide-react';
import { User } from '../../../services/api';
import apiService from '../../../services/api';

interface UsersSectionProps {
  onTotalChange: (total: number) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({ onTotalChange }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);

  // Función para recargar usuarios
  const refreshUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const response = await apiService.getUsers({ page: 1, limit: 20 });
      if (response.success && response.data) {
        setUsers(response.data.users);
        setUsersTotal(response.data.total);
        onTotalChange(response.data.total);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, [onTotalChange]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleExportUsers = useCallback(async () => {
    try {
      const response = await apiService.exportUsers();
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        alert('Exportación completada');
      } else {
        alert('Error al exportar usuarios');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportUsers}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            onClick={() => alert('Funcionalidad en desarrollo')}
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      {usersLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando usuarios...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                  <th className="text-left p-4 font-medium text-gray-700">Rol</th>
                  <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-700">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
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
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isVerified ? 'Verificado' : 'Sin verificar'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && !usersLoading && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay usuarios</h3>
              <p className="text-gray-600">Aún no se han registrado usuarios en el sistema.</p>
            </div>
          )}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <p className="text-3xl font-bold text-gray-800">
                {users.filter(u => u.isVerified).length}
              </p>
              <p className="text-green-600 text-sm">Activos</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Administradores</p>
              <p className="text-3xl font-bold text-gray-800">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <p className="text-purple-600 text-sm">Con permisos</p>
            </div>
            <Shield className="w-12 h-12 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersSection;