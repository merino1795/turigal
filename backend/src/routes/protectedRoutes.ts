import express from 'express';
import { AuthRequest, verifyToken } from '../middleware/verifyToken';

const router = express.Router();

// Ruta protegida de prueba
router.get('/me', verifyToken, (req: AuthRequest, res) => {
  res.json({
    message: 'Acceso autorizado ✅',
    user: req.user,
  });
});

export default router;
