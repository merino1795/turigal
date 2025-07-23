import React, { useState, useEffect } from 'react';
import apiService, { User, UsersResponse } from './services/api';
import { 
  Users, 
  Hotel, 
  Calendar, 
  Star, 
  Settings, 
  BarChart3, 
  FileText, 
  Shield, 
  Bell,
  Download,
  Edit,
  Trash2,
  AlertTriangle,
  LogOut,
  UserCheck,
  CheckSquare,
  TrendingUp,
  UserPlus,
  Lock,
  Key,
  X,
  Menu,
  Mail,
  Loader2
} from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      if (apiService.isAuthenticated() && !apiService.isTokenExpired()) {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success) {
            setIsAuthenticated(true);
          } else {
            apiService.logout();
          }
        } catch (error) {
          apiService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  // Mostrar loading inicial
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando TurisGal...</p>
        </div>
      </div>
    );
  }

  // Login Component
  const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@turisgal.com');
    const [password, setPassword] = useState('admin123');
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async () => {
      if (!email || !password) {
        setLoginError('Por favor, completa todos los campos');
        return;
      }

      setIsSubmitting(true);
      setLoginError('');
      
      try {
        const response = await apiService.login(email, password);
        
        if (response.success) {
          setIsAuthenticated(true);
        } else {
          setLoginError(response.error || 'Error al iniciar sesión');
        }
      } catch (error) {
        setLoginError('Error de conexión con el servidor');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isSubmitting) {
        handleLogin();
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🏨 TurisGal</h1>
            <p className="text-gray-600">Panel de Administración</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">Iniciar Sesión</h2>
            <p className="mt-2 text-gray-600">Accede a tu panel de control</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border p-8">
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {loginError}
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="admin@turisgal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Iniciando sesión...</span>
                  </>
                ) : (
                  <span>Iniciar Sesión</span>
                )}
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Credenciales de prueba:</strong>
              </p>
              <p className="text-sm text-gray-600">
                Email: admin@turisgal.com<br />
                Contraseña: admin123
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Admin Panel Component
  const AdminPanel: React.FC = () => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersTotal, setUsersTotal] = useState(0);

    // Estado para nuevos usuarios
    const [newUserData, setNewUserData] = useState({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });

    // Cargar usuario actual
    useEffect(() => {
      const loadCurrentUser = async () => {
        try {
          const response = await apiService.getCurrentUser();
          if (response.success && response.data) {
            setCurrentUser(response.data);
          }
        } catch (error) {
          console.error('Error loading current user:', error);
        }
      };
      loadCurrentUser();
    }, []);

    // Cargar usuarios cuando cambia la sección
    useEffect(() => {
      if (currentSection === 'users') {
        const loadUsers = async () => {
          setUsersLoading(true);
          try {
            const response = await apiService.getUsers({ page: 1, limit: 10 });
            if (response.success && response.data) {
              setUsers(response.data.users);
              setUsersTotal(response.data.total);
            }
          } catch (error) {
            console.error('Error loading users:', error);
            alert('Error al cargar usuarios');
          } finally {
            setUsersLoading(false);
          }
        };
        loadUsers();
      }
    }, [currentSection]);

    const handleCreateUser = async () => {
      if (!newUserData.email || !newUserData.firstName || !newUserData.lastName || !newUserData.password) {
        alert('Por favor, completa todos los campos');
        return;
      }

      try {
        const response = await apiService.createUser(newUserData);
        if (response.success) {
          setShowUserModal(false);
          setNewUserData({ email: '', firstName: '', lastName: '', password: '' });
          alert('Usuario creado correctamente');
          // Recargar usuarios si estamos en la sección de usuarios
          if (currentSection === 'users') {
            window.location.reload();
          }
        } else {
          alert(response.error || 'Error al crear usuario');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    };

    const handleExportUsers = async () => {
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
    };

    // Estadísticas simuladas
    const stats = {
      totalBookings: 347,
      todayCheckIns: 12,
      todayCheckOuts: 8,
      averageRating: 4.6,
      occupancyRate: 78,
      pendingIncidents: 5,
    };

    // Sidebar Navigation
    const Sidebar: React.FC = () => {
      const menuItems = [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
        { id: 'users', icon: Users, label: 'Usuarios', count: usersTotal },
        { id: 'bookings', icon: Calendar, label: 'Reservas', count: 15 },
        { id: 'properties', icon: Hotel, label: 'Alojamientos', count: 8 },
        { id: 'incidents', icon: AlertTriangle, label: 'Incidencias', count: 5 },
        { id: 'reviews', icon: Star, label: 'Reseñas', count: 3 },
        { id: 'reports', icon: FileText, label: 'Reportes' },
        { id: 'settings', icon: Settings, label: 'Configuración' },
      ];

      return (
        <>
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          <div className={`bg-gray-900 text-white w-64 min-h-screen p-4 fixed lg:static z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-2">🏨 TurisGal</h1>
                  <p className="text-gray-400 text-sm">Panel Administrador</p>
                </div>
                <button 
                  className="lg:hidden text-gray-400 hover:text-white"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <nav className="space-y-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    currentSection === item.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.count && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-medium mb-2">📊 Estado del Sistema</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ocupación</span>
                  <span className="text-green-400">{stats.occupancyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-ins hoy</span>
                  <span className="text-blue-400">{stats.todayCheckIns}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser ? currentUser.firstName.charAt(0) : 'U'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-400">{currentUser?.role || 'USER'}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      );
    };

    // Dashboard Section
    const Dashboard: React.FC = () => (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ocupación</p>
                <p className="text-3xl font-bold text-gray-800">{stats.occupancyRate}%</p>
                <p className="text-green-600 text-sm">↗ +5% vs ayer</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Check-ins Hoy</p>
                <p className="text-3xl font-bold text-gray-800">{stats.todayCheckIns}</p>
                <p className="text-blue-600 text-sm">Check-outs: {stats.todayCheckOuts}</p>
              </div>
              <UserCheck className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Satisfacción</p>
                <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
                <p className="text-yellow-600 text-sm">⭐ Promedio</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Incidencias</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pendingIncidents}</p>
                <p className="text-red-600 text-sm">Pendientes</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Bienvenido al Panel de TurisGal</h3>
          <p className="text-gray-600 mb-4">
            Desde aquí puedes gestionar todas las operaciones de tu plataforma de check-in digital.
          </p>
          {currentUser && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2">👋 Hola, {currentUser.firstName}!</h4>
              <p className="text-sm text-blue-600">
                Conectado como {currentUser.role} - {currentUser.email}
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">📊 Estadísticas en tiempo real</h4>
              <p className="text-sm text-blue-600">
                Monitoriza la ocupación, check-ins y satisfacción de los huéspedes.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">👥 Gestión de usuarios</h4>
              <p className="text-sm text-green-600">
                Administra el equipo, roles y permisos desde la sección de usuarios.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    // Users Section
    const UsersSection: React.FC = () => (
      <div className="space-y-6">
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
              onClick={() => setShowUserModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

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
                    <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
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
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 p-1">
                            <Key className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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

    // User Modal - CORREGIDO
    const UserModal: React.FC = () => {
      if (!showUserModal) {
        return null;
      }

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Nuevo Usuario</h3>
              <button 
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre"
                  value={newUserData.firstName}
                  onChange={(e) => setNewUserData({...newUserData, firstName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Apellido"
                  value={newUserData.lastName}
                  onChange={(e) => setNewUserData({...newUserData, lastName: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@turisgal.com"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contraseña inicial"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      );
    };

    // Main Content Area
    const renderContent = () => {
      switch(currentSection) {
        case 'dashboard': return <Dashboard />;
        case 'users': return <UsersSection />;
        default: 
          return (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Sección en desarrollo</h3>
              <p className="text-gray-600">Esta funcionalidad estará disponible próximamente.</p>
            </div>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
                  <p className="text-gray-600">Gestiona tu plataforma TurisGal</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser ? currentUser.firstName.charAt(0) : 'U'}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Usuario'}
                  </span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <UserModal />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isAuthenticated ? <AdminPanel /> : <LoginPage />}
    </div>
  );
}

export default App;