import express from 'express';
import { AuthRequest, verifyToken } from '../middleware/verifyToken';
import { authorizeRole } from '../middleware/autorizeRole';

const router = express.Router();

// Ruta protegida de prueba
router.get('/user', verifyToken, authorizeRole(['USER']), (req: AuthRequest, res) => {
  res.json({
    message: 'Acceso Usuario autorizado ✅',
    user: req.user,
  });
});

// Ruta solo para ADMIN
router.get('/admin-only', verifyToken, authorizeRole(['ADMIN']), (req, res) => {
  res.json({ message: 'Bienvenido administrador ✅' });
});

// Ruta para OWNER
router.get('/owners', verifyToken, authorizeRole(['OWNER']), (req, res) => {
  res.json({ message: 'Propietario o admin autenticado ✅' });
});
export default router;
