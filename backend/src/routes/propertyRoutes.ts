import express from 'express';
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  exportProperties,
  getPropertiesStats
} from '../controllers/propertyController';
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRole } from '../middleware/autorizeRole';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
// Obtener todas las propiedades (para búsquedas públicas)
router.get('/', getAllProperties);

// Obtener una propiedad específica (para vista pública)
router.get('/:id', getPropertyById);

// ===== RUTAS PROTEGIDAS =====

// Estadísticas de propiedades (solo admin)
router.get('/stats/overview', verifyToken, authorizeRole(['ADMIN']), getPropertiesStats);

// Exportar propiedades (solo admin)
router.get('/export/csv', verifyToken, authorizeRole(['ADMIN']), exportProperties);

// Crear nueva propiedad (solo owners y admins)
router.post('/', verifyToken, authorizeRole(['ADMIN', 'OWNER']), createProperty);

// Actualizar propiedad (solo owner de la propiedad o admin)
router.put('/:id', verifyToken, authorizeRole(['ADMIN', 'OWNER']), updateProperty);

// Eliminar propiedad (solo owner de la propiedad o admin)
router.delete('/:id', verifyToken, authorizeRole(['ADMIN', 'OWNER']), deleteProperty);

export default router;