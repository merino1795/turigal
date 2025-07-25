// src/components/admin/AdminPanel.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, Bell } from 'lucide-react';
import { User } from '../../services/api';
import apiService from '../../services/api';
import Sidebar from './Sidebar';
import Dashboard from './sections/Dashboard';
import PropertiesSection from './sections/PropertiesSection';
import UsersSection from './sections/UserSection';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Estados globales para compartir entre secciones
  const [usersTotal, setUsersTotal] = useState(0);
  const [propertiesTotal, setPropertiesTotal] = useState(0);

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

  const handleSectionChange = useCallback((section: string) => {
    setCurrentSection(section);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // Memoizar items del menú
  const menuItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'users', label: 'Usuarios', count: usersTotal },
    { id: 'properties', label: 'Alojamientos', count: propertiesTotal },
    { id: 'bookings', label: 'Reservas', count: 15 },
    { id: 'incidents', label: 'Incidencias', count: 5 },
    { id: 'reviews', label: 'Reseñas', count: 3 },
    { id: 'reports', label: 'Reportes' },
    { id: 'settings', label: 'Configuración' },
  ], [usersTotal, propertiesTotal]);

  // Main Content Area
  const renderContent = () => {
    switch(currentSection) {
      case 'dashboard': 
        return <Dashboard />;
      case 'users': 
        return <UsersSection onTotalChange={setUsersTotal} />;
      case 'properties': 
        return <PropertiesSection onTotalChange={setPropertiesTotal} />;
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
      <Sidebar
        currentSection={currentSection}
        sidebarOpen={sidebarOpen}
        menuItems={menuItems}
        currentUser={currentUser}
        onSectionChange={handleSectionChange}
        onCloseSidebar={closeSidebar}
        onLogout={onLogout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button 
                className="lg:hidden text-gray-600 hover:text-gray-800"
                onClick={toggleSidebar}
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
    </div>
  );
};

export default AdminPanel;