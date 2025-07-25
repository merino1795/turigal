// src/components/admin/Sidebar.tsx
import React from 'react';
import { 
  Users, Hotel, Calendar, Star, Settings, BarChart3, 
  FileText, AlertTriangle, LogOut, X 
} from 'lucide-react';
import { User } from '../../services/api';

interface MenuItem {
  id: string;
  label: string;
  count?: number;
}

interface SidebarProps {
  currentSection: string;
  sidebarOpen: boolean;
  menuItems: MenuItem[];
  currentUser: User | null;
  onSectionChange: (section: string) => void;
  onCloseSidebar: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  sidebarOpen,
  menuItems,
  currentUser,
  onSectionChange,
  onCloseSidebar,
  onLogout
}) => {
  // Mapeo de iconos
  const getIcon = (id: string) => {
    const iconMap = {
      dashboard: BarChart3,
      users: Users,
      properties: Hotel,
      bookings: Calendar,
      incidents: AlertTriangle,
      reviews: Star,
      reports: FileText,
      settings: Settings,
    };
    return iconMap[id as keyof typeof iconMap] || BarChart3;
  };

  // Stats del sistema (podrían venir como props)
  const systemStats = {
    occupancyRate: 78,
    todayCheckIns: 12,
  };

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseSidebar}
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
              onClick={onCloseSidebar}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map(item => {
            const IconComponent = getIcon(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                  currentSection === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count && item.count > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">📊 Estado del Sistema</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Ocupación</span>
              <span className="text-green-400">{systemStats.occupancyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Check-ins hoy</span>
              <span className="text-blue-400">{systemStats.todayCheckIns}</span>
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
              onClick={onLogout}
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

export default Sidebar;