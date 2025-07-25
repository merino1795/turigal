// src/components/admin/modals/DeletePropertyModal.tsx
import React, { useEffect, useRef } from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Property } from '../../../services/api';

interface DeletePropertyModalProps {
  isOpen: boolean;
  property: Property | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({ 
  isOpen, 
  property, 
  onClose, 
  onConfirm 
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Enfocar el botón de confirmación cuando se abra el modal
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
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
            <p className="text-sm text-gray-600 capitalize">{property.propertyType}</p>
            <p className="text-xs text-gray-500 mt-1">
              {property.address?.city}, {property.address?.country}
            </p>
          </div>
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">⚠️ Advertencia</p>
            <p className="text-sm text-red-600 mt-1">
              Esta acción eliminará también todas las habitaciones asociadas y no se puede deshacer.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Eliminar Propiedad</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePropertyModal;