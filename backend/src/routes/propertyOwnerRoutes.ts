import express from 'express';
import {
  createPropertyOwner,
  getAllPropertyOwners,
  getPropertyOwnerById,
  updatePropertyOwner,
  deletePropertyOwner
} from '../controllers/propertyOwnerController';
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRole } from '../middleware/autorizeRole';

const router = express.Router();

// ===== RUTAS PROTEGIDAS SOLO PARA ADMIN =====

// Obtener todos los propietarios (solo admin)
router.get('/', verifyToken, authorizeRole(['ADMIN']), getAllPropertyOwners);

// Crear nuevo propietario (solo admin)
router.post('/', verifyToken, authorizeRole(['ADMIN']), createPropertyOwner);

// Obtener un propietario específico (solo admin)
router.get('/:id', verifyToken, authorizeRole(['ADMIN']), getPropertyOwnerById);

// Actualizar propietario (solo admin)
router.put('/:id', verifyToken, authorizeRole(['ADMIN']), updatePropertyOwner);

// Eliminar propietario (solo admin)
router.delete('/:id', verifyToken, authorizeRole(['ADMIN']), deletePropertyOwner);

export default router;