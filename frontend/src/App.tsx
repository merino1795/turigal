import React, { useState, useEffect, useCallback, useMemo } from 'react';
import apiService, { User, UsersResponse, Property, PropertiesResponse, PropertyOwner } from './services/api';
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
  TrendingUp,
  UserPlus,
  Lock,
  Key,
  X,
  Menu,
  Mail,
  Loader2,
  Save,
  AlertCircle,
  MapPin,
  Building,
  Bed,
  Users as UsersIcon,
  Clock,
  Image,
  Plus
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

  const handleLogout = useCallback(() => {
    apiService.logout();
    setIsAuthenticated(false);
  }, []);

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

  // Login Component - OPTIMIZADO
  const LoginPage: React.FC = React.memo(() => {
    const [formData, setFormData] = useState({
      email: 'admin@turisgal.com',
      password: 'admin123'
    });
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Usar useCallback para evitar recrear funciones
    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }, []);

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
          setIsAuthenticated(true);
        } else {
          setLoginError(response.error || 'Error al iniciar sesión');
        }
      } catch (error) {
        setLoginError('Error de conexión con el servidor');
      } finally {
        setIsSubmitting(false);
      }
    }, [formData.email, formData.password]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isSubmitting) {
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
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                    value={formData.password}
                    onChange={handleInputChange('password')}
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
  // ✅ NUEVO MODAL: Crear/Editar Propiedad
  const PropertyModal: React.FC<{
    isOpen: boolean;
    property: Property | null;
    onClose: () => void;
    onSubmit: (propertyData: any) => void;
    owners: PropertyOwner[];
    isEditing?: boolean;
  }> = React.memo(({ isOpen, property, onClose, onSubmit, owners, isEditing = false }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      propertyType: 'apartment',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'España'
      },
      totalRooms: 1,
      maxGuests: 2,
      amenities: [] as string[],
      houseRules: '',
      checkInTime: '',
      checkOutTime: '',
      ownerId: '',
      isActive: true
    });

    const [amenityInput, setAmenityInput] = useState('');

    // Inicializar formulario
    useEffect(() => {
      if (isOpen) {
        if (isEditing && property) {
          setFormData({
            name: property.name,
            description: property.description || '',
            propertyType: property.propertyType,
            address: property.address || {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'España'
            },
            totalRooms: property.totalRooms,
            maxGuests: property.maxGuests,
            amenities: property.amenities || [],
            houseRules: property.houseRules || '',
            checkInTime: property.checkInTime ? property.checkInTime.substring(11, 16) : '',
            checkOutTime: property.checkOutTime ? property.checkOutTime.substring(11, 16) : '',
            ownerId: property.ownerId,
            isActive: property.isActive
          });
        } else {
          // Reset para nuevo
          setFormData({
            name: '',
            description: '',
            propertyType: 'apartment',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: 'España'
            },
            totalRooms: 1,
            maxGuests: 2,
            amenities: [],
            houseRules: '',
            checkInTime: '',
            checkOutTime: '',
            ownerId: '',
            isActive: true
          });
        }
        setAmenityInput('');
      }
    }, [isOpen, isEditing, property]);

    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
      setFormData(prev => ({
        ...prev,
        [field]: field === 'totalRooms' || field === 'maxGuests' ? parseInt(value as string) || 0 : value
      }));
    }, []);

    const handleAddressChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: e.target.value
        }
      }));
    }, []);

    const addAmenity = useCallback(() => {
      if (amenityInput.trim()) {
        setFormData(prev => ({
          ...prev,
          amenities: [...prev.amenities, amenityInput.trim()]
        }));
        setAmenityInput('');
      }
    }, [amenityInput]);

    const removeAmenity = useCallback((index: number) => {
      setFormData(prev => ({
        ...prev,
        amenities: prev.amenities.filter((_, i) => i !== index)
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      if (!formData.name || !formData.propertyType || !formData.address.city) {
        alert('Por favor, completa los campos obligatorios');
        return;
      }

      // Preparar datos para envío
      const submitData = {
        ...formData,
        checkInTime: formData.checkInTime ? `1970-01-01T${formData.checkInTime}:00` : null,
        checkOutTime: formData.checkOutTime ? `1970-01-01T${formData.checkOutTime}:00` : null,
      };

      onSubmit(submitData);
    }, [formData, onSubmit]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">Información Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Casa Rural Los Olivos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Propiedad *</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.propertyType}
                  onChange={handleInputChange('propertyType')}
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="villa">Villa</option>
                  <option value="hotel">Hotel</option>
                  <option value="hostel">Hostal</option>
                  <option value="rural">Casa Rural</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-24"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  placeholder="Describe tu propiedad..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.totalRooms}
                    onChange={handleInputChange('totalRooms')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Huéspedes máx.</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.maxGuests}
                    onChange={handleInputChange('maxGuests')}
                  />
                </div>
              </div>

              {owners.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.ownerId}
                    onChange={handleInputChange('ownerId')}
                  >
                    <option value="">Seleccionar propietario</option>
                    {owners.map(owner => (
                      <option key={owner.id} value={owner.id}>
                        {owner.contactName} {owner.companyName ? `(${owner.companyName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Dirección y detalles */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">Ubicación</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.address.street}
                  onChange={handleAddressChange('street')}
                  placeholder="Calle y número"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad *</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.city}
                    onChange={handleAddressChange('city')}
                    placeholder="Santiago de Compostela"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.state}
                    onChange={handleAddressChange('state')}
                    placeholder="A Coruña"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.zipCode}
                    onChange={handleAddressChange('zipCode')}
                    placeholder="15701"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.country}
                    onChange={handleAddressChange('country')}
                  />
                </div>
              </div>

              <h4 className="font-medium text-gray-800 border-b pb-2 mt-6">Horarios</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.checkInTime}
                    onChange={handleInputChange('checkInTime')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.checkOutTime}
                    onChange={handleInputChange('checkOutTime')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comodidades */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-800 border-b pb-2 mb-4">Comodidades</h4>
            <div className="flex space-x-2 mb-3">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="WiFi, Piscina, Aire acondicionado..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <button 
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <span 
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{amenity}</span>
                  <button 
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Reglas de la casa */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reglas de la Casa</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-20"
              value={formData.houseRules}
              onChange={handleInputChange('houseRules')}
              placeholder="No fumar, No mascotas, Silencio después de las 22:00..."
            />
          </div>

          {isEditing && (
            <div className="mt-6 flex items-center">
              <input 
                type="checkbox" 
                id="isActive"
                className="mr-2"
                checked={formData.isActive}
                onChange={handleInputChange('isActive')}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Propiedad activa
              </label>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-8">
            <button 
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  });

  // ✅ NUEVO MODAL: Confirmar Eliminación de Propiedad
  const DeletePropertyModal: React.FC<{
    isOpen: boolean;
    property: Property | null;
    onClose: () => void;
    onConfirm: () => void;
  }> = React.memo(({ isOpen, property, onClose, onConfirm }) => {
    if (!isOpen || !property) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center space-x-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
            <h3 className="text-lg font-bold text-gray-800">Confirmar Eliminación</h3>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar la propiedad?
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-800">{property.name}</p>
              <p className="text-sm text-gray-600">{property.propertyType}</p>
              <p className="text-xs text-gray-500 mt-1">
                {property.address?.city}, {property.address?.country}
              </p>
            </div>
            <p className="text-sm text-red-600 mt-3">
              ⚠️ Esta acción eliminará también todas las habitaciones asociadas.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button 
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar Propiedad</span>
            </button>
          </div>
        </div>
      </div>
    );
  });

  // User Modal Component - OPTIMIZADO
  const UserModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: any) => void;
  }> = React.memo(({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    });

    // ✅ Resetear formulario cuando se cierre el modal
    useEffect(() => {
      if (!isOpen) {
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          password: ''
        });
      }
    }, [isOpen]);

    // ✅ Usar useCallback para funciones de formulario
    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
    }, []);

    const handleSubmit = useCallback(() => {
      onSubmit(formData);
    }, [formData, onSubmit]);

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Nuevo Usuario</h3>
            <button 
              onClick={onClose}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Apellido"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="email@turisgal.com"
                value={formData.email}
                onChange={handleInputChange('email')}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Contraseña inicial"
                value={formData.password}
                onChange={handleInputChange('password')}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Crear Usuario
            </button>
          </div>
        </div>
      </div>
    );
  });

  // Admin Panel Component - OPTIMIZADO
  const AdminPanel: React.FC = React.memo(() => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Estados para usuarios
    const [showUserModal, setShowUserModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersTotal, setUsersTotal] = useState(0);

    // Estados para propiedades
    const [showPropertyModal, setShowPropertyModal] = useState(false);
    const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
    const [showDeletePropertyModal, setShowDeletePropertyModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [propertiesLoading, setPropertiesLoading] = useState(false);
    const [propertiesTotal, setPropertiesTotal] = useState(0);
    const [propertyOwners, setPropertyOwners] = useState<PropertyOwner[]>([]);

    // Estados para estadísticas del dashboard
    const [dashboardStats, setDashboardStats] = useState({
      totalProperties: 0,
      activeProperties: 0,
      totalRooms: 0,
      totalBookings: 347,
      todayCheckIns: 12,
      todayCheckOuts: 8,
      averageRating: 4.6,
      occupancyRate: 78,
      pendingIncidents: 5,
    });

    // ✅ NUEVO MODAL: Editar Usuario
    const EditUserModal: React.FC<{
      isOpen: boolean;
      user: User | null;
      onClose: () => void;
      onSubmit: (userData: any) => void;
    }> = React.memo(({ isOpen, user, onClose, onSubmit }) => {
      const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER' as 'ADMIN' | 'OWNER' | 'USER',
        isVerified: false
      });

      // ✅ Inicializar formulario con datos del usuario
      useEffect(() => {
        if (isOpen && user) {
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified
          });
        }
      }, [isOpen, user]);

      const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }, []);

      const handleSubmit = useCallback(() => {
        onSubmit(formData);
      }, [formData, onSubmit]);

      if (!isOpen || !user) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Editar Usuario</h3>
              <button 
                onClick={onClose}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.role}
                  onChange={handleInputChange('role')}
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
                />
                <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">
                  Usuario verificado
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </div>
      );
    });

    // ✅ NUEVO MODAL: Confirmar Eliminación
    const DeleteUserModal: React.FC<{
      isOpen: boolean;
      user: User | null;
      onClose: () => void;
      onConfirm: () => void;
    }> = React.memo(({ isOpen, user, onClose, onConfirm }) => {
      if (!isOpen || !user) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-lg font-bold text-gray-800">Confirmar Eliminación</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro de que deseas eliminar al usuario?
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">Rol: {user.role}</p>
              </div>
              <p className="text-sm text-red-600 mt-3">
                ⚠️ Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={onConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Usuario</span>
              </button>
            </div>
          </div>
        </div>
      );
    });

    // ✅ NUEVO MODAL: Cambiar Contraseña
    const PasswordModal: React.FC<{
      isOpen: boolean;
      user: User | null;
      onClose: () => void;
      onSubmit: (password: string) => void;
    }> = React.memo(({ isOpen, user, onClose, onSubmit }) => {
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');

      useEffect(() => {
        if (!isOpen) {
          setPassword('');
          setConfirmPassword('');
        }
      }, [isOpen]);

      const handleSubmit = useCallback(() => {
        if (password.length < 6) {
          alert('La contraseña debe tener al menos 6 caracteres');
          return;
        }
        if (password !== confirmPassword) {
          alert('Las contraseñas no coinciden');
          return;
        }
        onSubmit(password);
      }, [password, confirmPassword, onSubmit]);

      if (!isOpen || !user) return null;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Key className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Cambiar Contraseña</h3>
            </div>
            
            <div className="mb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="font-medium text-blue-800">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-blue-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
                <input 
                  type="password" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Repetir contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Key className="w-4 h-4" />
                <span>Cambiar Contraseña</span>
              </button>
            </div>
          </div>
        </div>
      );
    });
    const stats = useMemo(() => ({
      totalBookings: 347,
      todayCheckIns: 12,
      todayCheckOuts: 8,
      averageRating: 4.6,
      occupancyRate: 78,
      pendingIncidents: 5,
    }), []);

    // ✅ Usar useCallback para funciones
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

    const openUserModal = useCallback(() => {
      setShowUserModal(true);
    }, []);

    const closeUserModal = useCallback(() => {
      setShowUserModal(false);
    }, []);

    const openEditModal = useCallback((user: User) => {
      setSelectedUser(user);
      setShowEditModal(true);
    }, []);

    const closeEditModal = useCallback(() => {
      setShowEditModal(false);
      setSelectedUser(null);
    }, []);

    const openDeleteModal = useCallback((user: User) => {
      setSelectedUser(user);
      setShowDeleteModal(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }, []);

    const openPasswordModal = useCallback((user: User) => {
      setSelectedUser(user);
      setShowPasswordModal(true);
    }, []);

    const closePasswordModal = useCallback(() => {
      setShowPasswordModal(false);
      setSelectedUser(null);
    }, []);

    // ===== FUNCIONES PARA PROPIEDADES =====
    
    const openPropertyModal = useCallback(() => {
      setShowPropertyModal(true);
    }, []);

    const closePropertyModal = useCallback(() => {
      setShowPropertyModal(false);
    }, []);

    const openEditPropertyModal = useCallback((property: Property) => {
      setSelectedProperty(property);
      setShowEditPropertyModal(true);
    }, []);

    const closeEditPropertyModal = useCallback(() => {
      setShowEditPropertyModal(false);
      setSelectedProperty(null);
    }, []);

    const openDeletePropertyModal = useCallback((property: Property) => {
      setSelectedProperty(property);
      setShowDeletePropertyModal(true);
    }, []);

    const closeDeletePropertyModal = useCallback(() => {
      setShowDeletePropertyModal(false);
      setSelectedProperty(null);
    }, []);

    // ✅ Función para recargar usuarios
    const refreshUsers = useCallback(async () => {
      setUsersLoading(true);
      try {
        const response = await apiService.getUsers({ page: 1, limit: 10 });
        if (response.success && response.data) {
          setUsers(response.data.users);
          setUsersTotal(response.data.total);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setUsersLoading(false);
      }
    }, []);

    // ✅ Función para recargar propiedades
    const refreshProperties = useCallback(async () => {
      setPropertiesLoading(true);
      try {
        const response = await apiService.getProperties({ page: 1, limit: 10 });
        if (response.success && response.data) {
          setProperties(response.data.properties);
          setPropertiesTotal(response.data.total);
        }
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setPropertiesLoading(false);
      }
    }, []);

    // ✅ Función para cargar propietarios
    const loadPropertyOwners = useCallback(async () => {
      try {
        const response = await apiService.getPropertyOwners({ page: 1, limit: 100 });
        if (response.success && response.data) {
          setPropertyOwners(response.data.owners);
        }
      } catch (error) {
        console.error('Error loading property owners:', error);
      }
    }, []);

    // ✅ Función para cargar estadísticas del dashboard
    const loadDashboardStats = useCallback(async () => {
      try {
        const [propertiesResponse, propertyStatsResponse] = await Promise.all([
          apiService.getProperties({ page: 1, limit: 1 }), // Solo para el total
          apiService.getPropertyStats()
        ]);

        if (propertiesResponse.success && propertiesResponse.data) {
          const totalProperties = propertiesResponse.data.total;
          
          if (propertyStatsResponse.success && propertyStatsResponse.data) {
            const stats = propertyStatsResponse.data;
            setDashboardStats(prev => ({
              ...prev,
              totalProperties: stats.totalProperties,
              activeProperties: stats.activeProperties,
              totalRooms: stats.totalRooms,
            }));
          } else {
            // Fallback si no hay endpoint de stats
            setDashboardStats(prev => ({
              ...prev,
              totalProperties,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      }
    }, []);

    // Cargar usuario actual y estadísticas
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
      loadDashboardStats(); // Cargar estadísticas al inicio
    }, [loadDashboardStats]);

    // Cargar usuarios cuando cambia la sección
    useEffect(() => {
      if (currentSection === 'users') {
        refreshUsers();
      }
    }, [currentSection, refreshUsers]);

    // Cargar propiedades cuando cambia la sección
    useEffect(() => {
      if (currentSection === 'properties') {
        refreshProperties();
        loadPropertyOwners(); // Cargar propietarios para el dropdown
      }
    }, [currentSection, refreshProperties, loadPropertyOwners]);

    const handleCreateUser = useCallback(async (userData: any) => {
      if (!userData.email || !userData.firstName || !userData.lastName || !userData.password) {
        alert('Por favor, completa todos los campos');
        return;
      }

      try {
        const response = await apiService.createUser(userData);
        if (response.success) {
          setShowUserModal(false);
          alert('Usuario creado correctamente');
          await refreshUsers();
        } else {
          alert(response.error || 'Error al crear usuario');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [refreshUsers]);

    // ✅ NUEVA FUNCIÓN: Manejar edición de usuario
    const handleEditUser = useCallback(async (userData: any) => {
      if (!selectedUser) return;

      try {
        const response = await apiService.updateUser(selectedUser.id, userData);
        if (response.success) {
          setShowEditModal(false);
          setSelectedUser(null);
          alert('Usuario actualizado correctamente');
          await refreshUsers();
        } else {
          alert(response.error || 'Error al actualizar usuario');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [selectedUser, refreshUsers]);

    // ✅ NUEVA FUNCIÓN: Manejar eliminación de usuario
    const handleDeleteUser = useCallback(async () => {
      if (!selectedUser) return;

      try {
        const response = await apiService.deleteUser(selectedUser.id);
        if (response.success) {
          setShowDeleteModal(false);
          setSelectedUser(null);
          alert('Usuario eliminado correctamente');
          await refreshUsers();
        } else {
          alert(response.error || 'Error al eliminar usuario');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [selectedUser, refreshUsers]);

    // ✅ NUEVA FUNCIÓN: Manejar cambio de contraseña
    const handleChangePassword = useCallback(async (newPassword: string) => {
      if (!selectedUser) return;

      try {
        const response = await apiService.changeUserPassword(selectedUser.id, newPassword);
        if (response.success) {
          setShowPasswordModal(false);
          setSelectedUser(null);
          alert('Contraseña cambiada correctamente');
        } else {
          alert(response.error || 'Error al cambiar contraseña');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [selectedUser]);

    // ===== HANDLERS PARA PROPIEDADES =====

    const handleCreateProperty = useCallback(async (propertyData: any) => {
      try {
        const response = await apiService.createProperty(propertyData);
        if (response.success) {
          setShowPropertyModal(false);
          alert('Propiedad creada correctamente');
          await refreshProperties();
        } else {
          alert(response.error || 'Error al crear propiedad');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [refreshProperties]);

    const handleEditProperty = useCallback(async (propertyData: any) => {
      if (!selectedProperty) return;

      try {
        const response = await apiService.updateProperty(selectedProperty.id, propertyData);
        if (response.success) {
          setShowEditPropertyModal(false);
          setSelectedProperty(null);
          alert('Propiedad actualizada correctamente');
          await refreshProperties();
        } else {
          alert(response.error || 'Error al actualizar propiedad');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [selectedProperty, refreshProperties]);

    const handleDeleteProperty = useCallback(async () => {
      if (!selectedProperty) return;

      try {
        const response = await apiService.deleteProperty(selectedProperty.id);
        if (response.success) {
          setShowDeletePropertyModal(false);
          setSelectedProperty(null);
          alert('Propiedad eliminada correctamente');
          await refreshProperties();
        } else {
          alert(response.error || 'Error al eliminar propiedad');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, [selectedProperty, refreshProperties]);

    const handleExportProperties = useCallback(async () => {
      try {
        const response = await apiService.exportProperties();
        if (response.success && response.data) {
          const url = window.URL.createObjectURL(response.data);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'propiedades.csv';
          a.click();
          window.URL.revokeObjectURL(url);
          alert('Exportación completada');
        } else {
          alert('Error al exportar propiedades');
        }
      } catch (error) {
        alert('Error de conexión');
      }
    }, []);

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

    // ✅ Memoizar items del menú
    const menuItems = useMemo(() => [
      { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
      { id: 'users', icon: Users, label: 'Usuarios', count: usersTotal },
      { id: 'properties', icon: Hotel, label: 'Alojamientos', count: propertiesTotal },
      { id: 'bookings', icon: Calendar, label: 'Reservas', count: 15 },
      { id: 'incidents', icon: AlertTriangle, label: 'Incidencias', count: 5 },
      { id: 'reviews', icon: Star, label: 'Reseñas', count: 3 },
      { id: 'reports', icon: FileText, label: 'Reportes' },
      { id: 'settings', icon: Settings, label: 'Configuración' },
    ], [usersTotal, propertiesTotal]);

    // Sidebar Navigation - MEMOIZADO
    const Sidebar: React.FC = React.memo(() => (
      <>
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
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
                onClick={closeSidebar}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
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
    ));

    // Dashboard Section - MEMOIZADO
    const Dashboard: React.FC = React.memo(() => (
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
                <p className="text-gray-600 text-sm">Propiedades</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalProperties}</p>
                <p className="text-purple-600 text-sm">{stats.activeProperties} activas</p>
              </div>
              <Hotel className="w-12 h-12 text-purple-600" />
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
    // Properties Section - MEMOIZADO
    const PropertiesSection: React.FC = React.memo(() => (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Alojamientos</h2>
          <div className="flex space-x-3">
            <button 
              onClick={handleExportProperties}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button 
              onClick={openPropertyModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Propiedad</span>
            </button>
          </div>
        </div>

        {propertiesLoading ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando propiedades...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-700">Propiedad</th>
                    <th className="text-left p-4 font-medium text-gray-700">Tipo</th>
                    <th className="text-left p-4 font-medium text-gray-700">Ubicación</th>
                    <th className="text-left p-4 font-medium text-gray-700">Capacidad</th>
                    <th className="text-left p-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left p-4 font-medium text-gray-700">Propietario</th>
                    <th className="text-left p-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <Hotel className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{property.name}</div>
                            <div className="text-sm text-gray-600">
                              {property.totalRooms} habitación{property.totalRooms !== 1 ? 'es' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {property.propertyType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {property.address?.city || 'No especificado'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <UsersIcon className="w-4 h-4" />
                          <span>{property.maxGuests} huéspedes</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {property.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-800">
                            {property.owner?.contactName || 'No asignado'}
                          </div>
                          {property.owner?.companyName && (
                            <div className="text-gray-600">{property.owner.companyName}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => openEditPropertyModal(property)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            title="Editar propiedad"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeletePropertyModal(property)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                            title="Eliminar propiedad"
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Propiedades</p>
                <p className="text-3xl font-bold text-gray-800">{propertiesTotal}</p>
                <p className="text-blue-600 text-sm">En el sistema</p>
              </div>
              <Hotel className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Activas</p>
                <p className="text-3xl font-bold text-gray-800">
                  {properties.filter(p => p.isActive).length}
                </p>
                <p className="text-green-600 text-sm">Disponibles</p>
              </div>
              <UserCheck className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Habitaciones</p>
                <p className="text-3xl font-bold text-gray-800">
                  {properties.reduce((sum, p) => sum + p.totalRooms, 0)}
                </p>
                <p className="text-purple-600 text-sm">Total</p>
              </div>
              <Bed className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Capacidad</p>
                <p className="text-3xl font-bold text-gray-800">
                  {properties.reduce((sum, p) => sum + p.maxGuests, 0)}
                </p>
                <p className="text-orange-600 text-sm">Huéspedes max</p>
              </div>
              <UsersIcon className="w-12 h-12 text-orange-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Habitaciones</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
                  <p className="text-blue-600 text-sm">En todas las propiedades</p>
                </div>
                <Bed className="w-10 h-10 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Reservas Totales</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                  <p className="text-green-600 text-sm">Historial completo</p>
                </div>
                <Calendar className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Satisfacción</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
                  <p className="text-yellow-600 text-sm">⭐ Promedio</p>
                </div>
                <Star className="w-10 h-10 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ));

    // Users Section - MEMOIZADO
    const UsersSection: React.FC = React.memo(() => (
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
              onClick={openUserModal}
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
                          <button 
                            onClick={() => openEditModal(user)}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openPasswordModal(user)}
                            className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-50 rounded"
                            title="Cambiar contraseña"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteModal(user)}
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
    ));

    // Main Content Area
    const renderContent = () => {
      switch(currentSection) {
        case 'dashboard': return <Dashboard />;
        case 'users': return <UsersSection />;
        case 'properties': return <PropertiesSection />;
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
        
        <UserModal 
          isOpen={showUserModal}
          onClose={closeUserModal}
          onSubmit={handleCreateUser}
        />
        
        <EditUserModal 
          isOpen={showEditModal}
          user={selectedUser}
          onClose={closeEditModal}
          onSubmit={handleEditUser}
        />
        
        <DeleteUserModal 
          isOpen={showDeleteModal}
          user={selectedUser}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteUser}
        />
        
        <PasswordModal 
          isOpen={showPasswordModal}
          user={selectedUser}
          onClose={closePasswordModal}
          onSubmit={handleChangePassword}
        />

        <PropertyModal 
          isOpen={showPropertyModal}
          property={null}
          onClose={closePropertyModal}
          onSubmit={handleCreateProperty}
          owners={propertyOwners}
          isEditing={false}
        />
        
        <PropertyModal 
          isOpen={showEditPropertyModal}
          property={selectedProperty}
          onClose={closeEditPropertyModal}
          onSubmit={handleEditProperty}
          owners={propertyOwners}
          isEditing={true}
        />
        
        <DeletePropertyModal 
          isOpen={showDeletePropertyModal}
          property={selectedProperty}
          onClose={closeDeletePropertyModal}
          onConfirm={handleDeleteProperty}
        />
      </div>
    );
  });

  return (
    <div className="w-full h-full">
      {isAuthenticated ? <AdminPanel /> : <LoginPage />}
    </div>
  );
}

export default App;