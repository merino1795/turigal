// src/components/admin/sections/PropertiesSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Download, Plus, Search, X, Hotel, Edit, Trash2, 
  MapPin, Bed, Users as UsersIcon, CheckCircle, XCircle, Loader2 
} from 'lucide-react';
import { Property, PropertyOwner } from '../../../services/api';
import apiService from '../../../services/api';
import PropertyModal from '../modals/PropertyModal';
import DeletePropertyModal from '../modals/DeletePropertyModal';

interface PropertiesSectionProps {
  onTotalChange: (total: number) => void;
}

const PropertiesSection: React.FC<PropertiesSectionProps> = ({ onTotalChange }) => {
  // Estados principales
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const [propertiesTotal, setPropertiesTotal] = useState(0);
  const [propertyOwners, setPropertyOwners] = useState<PropertyOwner[]>([]);

  // Estados para modales
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showEditPropertyModal, setShowEditPropertyModal] = useState(false);
  const [showDeletePropertyModal, setShowDeletePropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Estados para filtros
  const [propertyFilters, setPropertyFilters] = useState({
    search: '',
    propertyType: '',
    isActive: '',
    ownerId: ''
  });

  // Estados para operaciones
  const [isExporting, setIsExporting] = useState(false);

  // Función para recargar propiedades
  const refreshProperties = useCallback(async () => {
    setPropertiesLoading(true);
    try {
      const filters: any = { page: 1, limit: 50 };
      
      // Solo agregar filtros que tienen valor
      if (propertyFilters.search.trim()) {
        filters.search = propertyFilters.search.trim();
      }
      if (propertyFilters.propertyType) {
        filters.propertyType = propertyFilters.propertyType;
      }
      if (propertyFilters.isActive) {
        filters.isActive = propertyFilters.isActive === 'true';
      }
      if (propertyFilters.ownerId) {
        filters.ownerId = propertyFilters.ownerId;
      }

      const response = await apiService.getProperties(filters);
      if (response.success && response.data) {
        setProperties(response.data.properties);
        setPropertiesTotal(response.data.total);
        onTotalChange(response.data.total);
      } else {
        console.error('Error en respuesta:', response.error);
        setProperties([]);
        setPropertiesTotal(0);
        onTotalChange(0);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
      setPropertiesTotal(0);
      onTotalChange(0);
    } finally {
      setPropertiesLoading(false);
    }
  }, [propertyFilters, onTotalChange]);

  // Función para cargar propietarios
  const loadPropertyOwners = useCallback(async () => {
    try {
      const response = await apiService.getPropertyOwners({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setPropertyOwners(response.data.owners);
      } else {
        console.error('Error loading owners:', response.error);
        setPropertyOwners([]);
      }
    } catch (error) {
      console.error('Error loading property owners:', error);
      setPropertyOwners([]);
    }
  }, []);

  // Cargar datos al montar el componente y cuando cambien los filtros
  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  // Cargar propietarios solo una vez al montar
  useEffect(() => {
    loadPropertyOwners();
  }, [loadPropertyOwners]);

  // Handlers para modales
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

  // Handlers para acciones
  const handleCreateProperty = useCallback(async (propertyData: any) => {
    try {
      const response = await apiService.createProperty(propertyData);
      if (response.success) {
        closePropertyModal();
        alert('Propiedad creada correctamente');
        await refreshProperties();
      } else {
        alert(response.error || 'Error al crear propiedad');
      }
    } catch (error) {
      console.error('Error creating property:', error);
      alert('Error de conexión');
    }
  }, [refreshProperties]);

  const handleEditProperty = useCallback(async (propertyData: any) => {
    if (!selectedProperty) return;

    try {
      const response = await apiService.updateProperty(selectedProperty.id, propertyData);
      if (response.success) {
        closeEditPropertyModal();
        alert('Propiedad actualizada correctamente');
        await refreshProperties();
      } else {
        alert(response.error || 'Error al actualizar propiedad');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Error de conexión');
    }
  }, [selectedProperty, refreshProperties]);

  const handleDeleteProperty = useCallback(async () => {
    if (!selectedProperty) return;

    try {
      const response = await apiService.deleteProperty(selectedProperty.id);
      if (response.success) {
        closeDeletePropertyModal();
        alert('Propiedad eliminada correctamente');
        await refreshProperties();
      } else {
        alert(response.error || 'Error al eliminar propiedad');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error de conexión');
    }
  }, [selectedProperty, refreshProperties]);

  const handleExportProperties = useCallback(async () => {
    setIsExporting(true);
    try {
      const filters: any = {};
      
      if (propertyFilters.search.trim()) {
        filters.search = propertyFilters.search.trim();
      }
      if (propertyFilters.propertyType) {
        filters.propertyType = propertyFilters.propertyType;
      }
      if (propertyFilters.isActive) {
        filters.isActive = propertyFilters.isActive === 'true';
      }
      if (propertyFilters.ownerId) {
        filters.ownerId = propertyFilters.ownerId;
      }

      const response = await apiService.exportProperties(filters);
      if (response.success && response.data) {
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = `propiedades_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Exportación completada');
      } else {
        alert('Error al exportar propiedades');
      }
    } catch (error) {
      console.error('Error exporting properties:', error);
      alert('Error de conexión');
    } finally {
      setIsExporting(false);
    }
  }, [propertyFilters]);

  // Manejar cambios en filtros
  const handlePropertyFilterChange = useCallback((field: string, value: string) => {
    setPropertyFilters(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const clearPropertyFilters = useCallback(() => {
    setPropertyFilters({
      search: '',
      propertyType: '',
      isActive: '',
      ownerId: ''
    });
  }, []);

  // Comprobar si hay filtros activos
  const hasActiveFilters = Object.values(propertyFilters).some(filter => filter);

  // Calcular estadísticas
  const activePropertiesCount = properties.filter(p => p.isActive).length;
  const totalRooms = properties.reduce((sum, p) => sum + p.totalRooms, 0);
  const totalCapacity = properties.reduce((sum, p) => sum + p.maxGuests, 0);

  // Distribución por tipo
  const propertyTypeDistribution = properties.reduce((acc, property) => {
    const type = property.propertyType || 'other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Función para traducir tipos de propiedad
  const translatePropertyType = (type: string): string => {
    const translations: Record<string, string> = {
      apartment: 'Apartamentos',
      house: 'Casas',
      villa: 'Villas',
      hotel: 'Hoteles',
      hostel: 'Hostales',
      rural: 'Casas Rurales',
      other: 'Otros'
    };
    return translations[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Alojamientos</h2>
          <p className="text-gray-600 mt-1">
            {propertiesTotal} {propertiesTotal === 1 ? 'propiedad' : 'propiedades'} 
            {hasActiveFilters && ' (filtradas)'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExportProperties}
            disabled={propertiesLoading || isExporting}
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
            onClick={openPropertyModal}
            disabled={propertiesLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Propiedad</span>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Nombre, ciudad..."
                value={propertyFilters.search}
                onChange={(e) => handlePropertyFilterChange('search', e.target.value)}
                disabled={propertiesLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={propertyFilters.propertyType}
              onChange={(e) => handlePropertyFilterChange('propertyType', e.target.value)}
              disabled={propertiesLoading}
            >
              <option value="">Todos los tipos</option>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={propertyFilters.isActive}
              onChange={(e) => handlePropertyFilterChange('isActive', e.target.value)}
              disabled={propertiesLoading}
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              value={propertyFilters.ownerId}
              onChange={(e) => handlePropertyFilterChange('ownerId', e.target.value)}
              disabled={propertiesLoading}
            >
              <option value="">Todos los propietarios</option>
              {propertyOwners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.contactName} {owner.companyName ? `(${owner.companyName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Solo mostrar botón de limpiar si hay filtros activos */}
        {hasActiveFilters && (
          <div className="flex justify-end mt-4">
            <button
              onClick={clearPropertyFilters}
              disabled={propertiesLoading}
              className="text-gray-600 hover:text-gray-800 text-sm flex items-center space-x-1 transition-colors disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* Tabla de propiedades */}
      {propertiesLoading ? (
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando propiedades...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {properties.length > 0 ? (
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
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
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
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {property.propertyType}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {property.address?.city || 'No especificado'}
                            {property.address?.state && `, ${property.address.state}`}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <UsersIcon className="w-4 h-4" />
                            <span>{property.maxGuests} huéspedes</span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Bed className="w-4 h-4" />
                            <span>{property.totalRooms} habitaciones</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                          property.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {property.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Activo</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Inactivo</span>
                            </>
                          )}
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
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                            title="Editar propiedad"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeletePropertyModal(property)}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
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
          ) : (
            <div className="text-center py-12">
              <Hotel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No hay propiedades</h3>
              <p className="text-gray-600 mb-4">
                {hasActiveFilters 
                  ? 'No se encontraron propiedades con los filtros aplicados.'
                  : 'Aún no has creado ninguna propiedad.'
                }
              </p>
              {!hasActiveFilters && (
                <button 
                  onClick={openPropertyModal}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 mx-auto transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Primera Propiedad</span>
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
              <p className="text-3xl font-bold text-gray-800">{activePropertiesCount}</p>
              <p className="text-green-600 text-sm">Disponibles</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Habitaciones</p>
              <p className="text-3xl font-bold text-gray-800">{totalRooms}</p>
              <p className="text-purple-600 text-sm">Total</p>
            </div>
            <Bed className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Capacidad</p>
              <p className="text-3xl font-bold text-gray-800">{totalCapacity}</p>
              <p className="text-orange-600 text-sm">Huéspedes max</p>
            </div>
            <UsersIcon className="w-12 h-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Distribución por tipo (solo si hay propiedades) */}
      {properties.length > 0 && Object.keys(propertyTypeDistribution).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Tipo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(propertyTypeDistribution).map(([type, count]) => (
              <div key={type} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-800">{count}</p>
                <p className="text-sm text-gray-600">{translatePropertyType(type)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modales */}
      {showPropertyModal && (
        <PropertyModal 
          isOpen={showPropertyModal}
          property={null}
          owners={propertyOwners}
          onClose={closePropertyModal}
          onSubmit={handleCreateProperty}
          isEditing={false}
        />
      )}
      
      {showEditPropertyModal && selectedProperty && (
        <PropertyModal 
          isOpen={showEditPropertyModal}
          property={selectedProperty}
          owners={propertyOwners}
          onClose={closeEditPropertyModal}
          onSubmit={handleEditProperty}
          isEditing={true}
        />
      )}
      
      {showDeletePropertyModal && selectedProperty && (
        <DeletePropertyModal 
          isOpen={showDeletePropertyModal}
          property={selectedProperty}
          onClose={closeDeletePropertyModal}
          onConfirm={handleDeleteProperty}
        />
      )}
    </div>
  );
};

export default PropertiesSection;