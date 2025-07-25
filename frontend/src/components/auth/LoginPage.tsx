// src/components/auth/LoginPage.tsx
import React, { useState, useCallback } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import apiService from '../../services/api';

interface LoginPageProps {
  onLogin: (success: boolean) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'admin@turisgal.com',
    password: 'admin123'
  });
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Limpiar error al escribir
    if (loginError) {
      setLoginError('');
    }
  }, [loginError]);

  const handleLogin = useCallback(async () => {
    if (!formData.email || !formData.password) {
      setLoginError('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');
    
    try {
      const response = await apiService.login(formData.email, formData.password);
      
      if (response.success) {
        onLogin(true);
      } else {
        setLoginError(response.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      setLoginError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email, formData.password, onLogin]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleLogin();
    }
  }, [handleLogin, isSubmitting]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitting) {
      handleLogin();
    }
  }, [handleLogin, isSubmitting]);

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
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="admin@turisgal.com"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  onKeyDown={handleKeyPress}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  onKeyDown={handleKeyPress}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
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
          </form>
          
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

export default LoginPage;