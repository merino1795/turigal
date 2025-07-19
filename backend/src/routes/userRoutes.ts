import express from 'express';
import { createUser, getAllUsers, exportUsers, getCurrentUser, updateCurrentUser, deleteCurrentUser} from '../controllers/userController';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/export', exportUsers);
router.get('/user', verifyToken, getCurrentUser);
router.get('/user', verifyToken, updateCurrentUser);
router.get('/user', verifyToken, deleteCurrentUser);


export default router;
