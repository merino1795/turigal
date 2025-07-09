import express from 'express';
import { createUser, getAllUsers, exportUsers } from '../controllers/userController';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/export', exportUsers);


export default router;
