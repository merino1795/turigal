// src/App.tsx - Refactorizado y modular
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import apiService from './services/api';
import LoginPage from './components/auth/LoginPage';
import AdminPanel from './components/admin/AdminPanel';

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

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

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

  return (
    <div className="w-full h-full">
      {isAuthenticated ? (
        <AdminPanel onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;