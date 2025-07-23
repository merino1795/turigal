import express from 'express';
import { createUser, getAllUsers, exportUsers, getCurrentUser, updateCurrentUser, deleteCurrentUser} from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';
import { authorizeRole } from '../middleware/autorizeRole';

const router = express.Router();

// Rutas públicas
router.post('/', createUser);

// Rutas protegidas que requieren autenticación
router.get('/', verifyToken, authorizeRole(['ADMIN']), getAllUsers);
router.get('/export', verifyToken, authorizeRole(['ADMIN']), exportUsers);

// Rutas para el usuario actual autenticado
router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateCurrentUser);
router.delete('/me', verifyToken, deleteCurrentUser);

export default router;