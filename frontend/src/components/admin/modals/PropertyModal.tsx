// src/components/admin/modals/PropertyModal.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Property, PropertyOwner } from '../../../services/api';

interface PropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  owners: PropertyOwner[];
  onClose: () => void;
  onSubmit: (propertyData: any) => Promise<void>;
  isEditing?: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ 
  isOpen, 
  property, 
  owners, 
  onClose, 
  onSubmit, 
  isEditing = false 
}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Referencias para mantener el foco
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Inicializar formulario cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      if (isEditing && property) {
        setFormData({
          name: property.name,
          description: property.description || '',
          propertyType: property.propertyType,
          address: {
            street: property.address?.street || '',
            city: property.address?.city || '',
            state: property.address?.state || '',
            zipCode: property.address?.zipCode || '',
            country: property.address?.country || 'España'
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
        // Reset para nueva propiedad
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
      setIsSubmitting(false);
      setErrors({});

      // Enfocar el primer campo después de que el modal se renderice
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isEditing, property]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, isSubmitting]);

  // Validaciones
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'La ciudad es obligatoria';
    }

    if (formData.totalRooms < 1) {
      newErrors.totalRooms = 'Debe tener al menos 1 habitación';
    }

    if (formData.maxGuests < 1) {
      newErrors.maxGuests = 'Debe permitir al menos 1 huésped';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    
    setFormData(prev => ({
      ...prev,
      [field]: field === 'totalRooms' || field === 'maxGuests' ? Math.max(1, parseInt(value as string) || 1) : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const handleAddressChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));

    // Limpiar error de ciudad si está escribiendo
    if (field === 'city' && errors.city) {
      setErrors(prev => ({ ...prev, city: '' }));
    }
  }, [errors.city]);

  const addAmenity = useCallback(() => {
    const trimmed = amenityInput.trim();
    if (trimmed && !formData.amenities.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, trimmed]
      }));
      setAmenityInput('');
    }
  }, [amenityInput, formData.amenities]);

  const removeAmenity = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  }, []);

  const handleAmenityKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAmenity();
    }
  }, [addAmenity]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para envío
      const submitData = {
        ...formData,
        checkInTime: formData.checkInTime ? `1970-01-01T${formData.checkInTime}:00` : null,
        checkOutTime: formData.checkOutTime ? `1970-01-01T${formData.checkOutTime}:00` : null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting property:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-800 border-b pb-2">Información Básica</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input 
                  ref={firstInputRef}
                  type="text" 
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  placeholder="Casa Rural Los Olivos"
                  disabled={isSubmitting}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Propiedad *
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  value={formData.propertyType}
                  onChange={handleInputChange('propertyType')}
                  disabled={isSubmitting}
                  required
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Habitaciones *</label>
                  <input 
                    type="number" 
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.totalRooms ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formData.totalRooms}
                    onChange={handleInputChange('totalRooms')}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.totalRooms && <p className="mt-1 text-sm text-red-600">{errors.totalRooms}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Huéspedes máx. *</label>
                  <input 
                    type="number" 
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.maxGuests ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formData.maxGuests}
                    onChange={handleInputChange('maxGuests')}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.maxGuests && <p className="mt-1 text-sm text-red-600">{errors.maxGuests}</p>}
                </div>
              </div>

              {owners.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Propietario</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.ownerId}
                    onChange={handleInputChange('ownerId')}
                    disabled={isSubmitting}
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

            {/* Dirección */}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input 
                    type="text" 
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    }`}
                    value={formData.address.city}
                    onChange={handleAddressChange('city')}
                    placeholder="Santiago de Compostela"
                    disabled={isSubmitting}
                    required
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.state}
                    onChange={handleAddressChange('state')}
                    placeholder="A Coruña"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.address.country}
                    onChange={handleAddressChange('country')}
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input 
                    type="time" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    value={formData.checkOutTime}
                    onChange={handleInputChange('checkOutTime')}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Comodidades */}
          <div>
            <h4 className="font-medium text-gray-800 border-b pb-2 mb-4">Comodidades</h4>
            <div className="flex space-x-2 mb-3">
              <input 
                type="text" 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyDown={handleAmenityKeyPress}
                placeholder="WiFi, Piscina, Aire acondicionado..."
                disabled={isSubmitting}
              />
              <button 
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                disabled={isSubmitting || !amenityInput.trim()}
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
                    className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Reglas de la casa */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reglas de la Casa</label>
            <textarea 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-20"
              value={formData.houseRules}
              onChange={handleInputChange('houseRules')}
              placeholder="No fumar, No mascotas, Silencio después de las 22:00..."
              disabled={isSubmitting}
            />
          </div>

          {/* Estado (solo en edición) */}
          {isEditing && (
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="isActive"
                className="mr-2"
                checked={formData.isActive}
                onChange={handleInputChange('isActive')}
                disabled={isSubmitting}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Propiedad activa
              </label>
            </div>
          )}
          
          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:bg-blue-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyModal;