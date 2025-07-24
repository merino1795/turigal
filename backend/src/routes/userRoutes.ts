import express from 'express';
import { 
  createUser, 
  getAllUsers, 
  exportUsers, 
  getCurrentUser, 
  updateCurrentUser, 
  deleteCurrentUser,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword
} from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRole } from '../middleware/autorizeRole';

const router = express.Router();

// ===== RUTAS PÚBLICAS =====
router.post('/', createUser);

// ===== RUTAS PROTEGIDAS QUE REQUIEREN AUTENTICACIÓN =====

// ⚠️ IMPORTANTE: Las rutas específicas (/me, /export) deben ir ANTES que las rutas con parámetros (:id)

// Rutas para administradores - gestión de todos los usuarios
router.get('/', verifyToken, authorizeRole(['ADMIN']), getAllUsers);
router.get('/export', verifyToken, authorizeRole(['ADMIN']), exportUsers);

// Rutas para el usuario actual autenticado (deben ir antes que /:id)
router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateCurrentUser);
router.delete('/me', verifyToken, deleteCurrentUser);

// Rutas para usuarios específicos por ID (solo administradores)
router.get('/:id', verifyToken, authorizeRole(['ADMIN']), getUserById);
router.put('/:id', verifyToken, authorizeRole(['ADMIN']), updateUser);
router.delete('/:id', verifyToken, authorizeRole(['ADMIN']), deleteUser);
router.patch('/:id/password', verifyToken, authorizeRole(['ADMIN']), changeUserPassword);

export default router;