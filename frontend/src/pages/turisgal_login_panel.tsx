import React, { useState, useEffect } from 'react';
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
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertTriangle,
  LogOut,
  UserCheck,
  QrCode,
  Send,
  AlertCircle,
  Target,
  CheckSquare,
  TrendingUp,
  UserPlus,
  Lock,
  Key,
  X,
  Menu,
  Mail
} from 'lucide-react';

const TurisGalApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Login Component - CENTRADO Y RESPONSIVE
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const validCredentials = {
      email: 'admin@turisgal.com',
      password: 'admin123'
    };

    const handleLogin = () => {
      setLoginError('');
      if (email === validCredentials.email && password === validCredentials.password) {
        setIsAuthenticated(true);
      } else {
        setLoginError('Email o contraseña incorrectos');
      }
    };

    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        handleLogin();
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8">
          <div className="text-center">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-2">🏨 TurisGal</h1>
              <p className="text-sm sm:text-base text-gray-600">Panel de Administración</p>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Accede a tu panel de control
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg border p-6 sm:p-8">
            <div className="space-y-4 sm:space-y-6">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                    placeholder="admin@turisgal.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-base"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base"
                >
                  Iniciar Sesión
                </button>
              </div>
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
  const AdminPanel = () => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    const [currentUser] = useState({
      id: 1,
      name: 'Carlos Administrador',
      email: 'carlos@turisgal.com',
      role: 'super_admin',
      permissions: ['all']
    });

    const [users, setUsers] = useState([
      {
        id: 1,
        name: 'Carlos Administrador',
        email: 'carlos@turisgal.com',
        role: 'super_admin',
        status: 'active',
        lastLogin: '2025-07-20T10:30:00',
        permissions: ['all']
      },
      {
        id: 2,
        name: 'Ana Manager',
        email: 'ana@turisgal.com',
        role: 'manager',
        status: 'active',
        lastLogin: '2025-07-20T09:15:00',
        permissions: ['bookings', 'properties', 'incidents']
      },
      {
        id: 3,
        name: 'Luis Recepcionista',
        email: 'luis@turisgal.com',
        role: 'staff',
        status: 'active',
        lastLogin: '2025-07-20T08:00:00',
        permissions: ['bookings', 'incidents']
      }
    ]);

    const [stats] = useState({
      totalBookings: 347,
      todayCheckIns: 12,
      todayCheckOuts: 8,
      totalRevenue: 45670,
      averageRating: 4.6,
      occupancyRate: 78,
      pendingIncidents: 5,
      completedTasks: 89
    });

    const [notifications] = useState([
      {
        id: 'NOT-001',
        type: 'incident',
        title: 'Nueva incidencia reportada',
        message: 'Aire acondicionado en habitación 205',
        time: '2025-07-20T09:30:00',
        read: false
      },
      {
        id: 'NOT-002',
        type: 'booking',
        title: 'Nueva reserva confirmada',
        message: 'Juan García - Hotel Vista Mar',
        time: '2025-07-20T08:15:00',
        read: false
      }
    ]);

    // Close sidebar on window resize to desktop
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          setSidebarOpen(false);
        }
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleToggleUserStatus = (userId) => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));
      showAlert('Estado del usuario actualizado', 'success');
    };

    const handleDeleteItem = (type, id) => {
      setItemToDelete({ type, id });
      setShowDeleteModal(true);
    };

    const confirmDelete = () => {
      const { type, id } = itemToDelete;
      
      if (type === 'user') {
        setUsers(prev => prev.filter(user => user.id !== id));
      }
      
      setShowDeleteModal(false);
      setItemToDelete(null);
      showAlert('Elemento eliminado correctamente', 'success');
    };

    const handleExportData = (type) => {
      console.log('Exportando datos:', type);
      showAlert(`Exportando datos de ${type}...`, 'info');
    };

    const showAlert = (message, type = 'info') => {
      console.log(`${type.toUpperCase()}: ${message}`);
    };

    // Sidebar Navigation
    const Sidebar = () => {
      const menuItems = [
        { id: 'dashboard', icon: BarChart3, label: 'Dashboard', count: null },
        { id: 'bookings', icon: Calendar, label: 'Reservas', count: 15 },
        { id: 'properties', icon: Hotel, label: 'Alojamientos', count: 8 },
        { id: 'users', icon: Users, label: 'Usuarios', count: users.length },
        { id: 'incidents', icon: AlertTriangle, label: 'Incidencias', count: 5 },
        { id: 'tasks', icon: CheckSquare, label: 'Tareas', count: 12 },
        { id: 'reviews', icon: Star, label: 'Reseñas', count: 3 },
        { id: 'reports', icon: FileText, label: 'Reportes', count: null },
        { id: 'settings', icon: Settings, label: 'Configuración', count: null },
      ];

      return (
        <>
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          
          {/* Sidebar */}
          <div className={`bg-gray-900 text-white w-64 min-h-screen p-4 fixed lg:static z-50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold mb-2">🏨 TurisGal</h1>
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
                    <span className="text-sm sm:text-base">{item.label}</span>
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
              <h3 className="font-medium mb-2 text-sm sm:text-base">📊 Estado del Sistema</h3>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ocupación</span>
                  <span className="text-green-400">{stats.occupancyRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-ins hoy</span>
                  <span className="text-blue-400">{stats.todayCheckIns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Incidencias</span>
                  <span className="text-red-400">{stats.pendingIncidents}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-gray-400">{currentUser.role}</p>
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
    const Dashboard = () => (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h2>
          <button 
            onClick={() => handleExportData('dashboard')}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Ocupación Actual</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800">{stats.occupancyRate}%</p>
                <p className="text-green-600 text-xs sm:text-sm">↗ +5% vs ayer</p>
              </div>
              <TrendingUp className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Check-ins Hoy</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800">{stats.todayCheckIns}</p>
                <p className="text-blue-600 text-xs sm:text-sm">Check-outs: {stats.todayCheckOuts}</p>
              </div>
              <UserCheck className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Satisfacción</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800">{stats.averageRating}</p>
                <p className="text-yellow-600 text-xs sm:text-sm">⭐ Promedio general</p>
              </div>
              <Star className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Incidencias</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-800">{stats.pendingIncidents}</p>
                <p className="text-red-600 text-xs sm:text-sm">Pendientes</p>
              </div>
              <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            🎯 Bienvenido al Panel de TurisGal
          </h3>
          <p className="text-gray-600 mb-4">
            Desde aquí puedes gestionar todas las operaciones de tu plataforma de check-in digital.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    const UsersSection = () => (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Usuarios</h2>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button 
              onClick={() => handleExportData('users')}
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button 
              onClick={() => setShowUserModal(true)}
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Nuevo Usuario</span>
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleUserStatus(user.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rol:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'super_admin' ? 'Super Admin' :
                     user.role === 'manager' ? 'Manager' :
                     'Staff'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Último acceso:</span>
                  <span className="text-xs text-gray-500">
                    {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 p-1" title="Cambiar contraseña">
                    <Key className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteItem('user', user.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-xl shadow-sm border hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Usuario</th>
                  <th className="text-left p-4 font-medium text-gray-700">Rol</th>
                  <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left p-4 font-medium text-gray-700">Último Acceso</th>
                  <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'super_admin' ? 'Super Admin' :
                         user.role === 'manager' ? 'Manager' :
                         'Staff'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-gray-800">
                          {new Date(user.lastLogin).toLocaleDateString('es-ES')}
                        </div>
                        <div className="text-gray-500">
                          {new Date(user.lastLogin).toLocaleTimeString('es-ES', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                          title="Editar usuario"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded"
                          title="Cambiar contraseña"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem('user', user.id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
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
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Usuarios</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">{users.length}</p>
                <p className="text-blue-600 text-sm">En el sistema</p>
              </div>
              <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Usuarios Activos</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-green-600 text-sm">
                  {Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% del total
                </p>
              </div>
              <UserCheck className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Administradores</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {users.filter(u => u.role === 'super_admin' || u.role === 'manager').length}
                </p>
                <p className="text-purple-600 text-sm">Con permisos elevados</p>
              </div>
              <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    );

    // User Modal
    const UserModal = () => (
      showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nombre del usuario"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@turisgal.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña temporal
                </label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contraseña inicial"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
              <button 
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowUserModal(false);
                  showAlert('Usuario creado correctamente', 'success');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Crear Usuario
              </button>
            </div>
          </div>
        </div>
      )
    );

    // Delete Confirmation Modal
    const DeleteModal = () => (
      showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              ¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )
    );

    // Main Content Area
    const renderContent = () => {
      switch(currentSection) {
        case 'dashboard': return <Dashboard />;
        case 'users': return <UsersSection />;
        default: return <Dashboard />;
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-100 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 p-3 sm:p-6 flex-shrink-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <button 
                  className="lg:hidden text-gray-600 hover:text-gray-800"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-800">Panel de Administración</h1>
                  <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Gestiona tu plataforma de check-in digital</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 cursor-pointer" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-800">Notificaciones</h3>
                      </div>
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                        >
                          <h4 className="font-medium text-gray-800 text-sm">{notification.title}</h4>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.time).toLocaleString('es-ES')}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-gray-700 font-medium text-sm sm:text-base hidden sm:block">{currentUser.name}</span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-3 sm:p-6">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <DeleteModal />
        <UserModal />
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      {isAuthenticated ? <AdminPanel /> : <LoginPage />}
    </div>
  );
};

export default TurisGalApp;