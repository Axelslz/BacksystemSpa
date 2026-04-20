import express from 'express';
import { register, login, logout, getUsers, updateUser, deleteUser, getEspecialistas } from '../controllers/authController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', protect, logout); 
router.post('/register', protect, adminOnly, register); 
router.get('/especialistas', protect, getEspecialistas);


router.get('/users', protect, adminOnly, getUsers);
router.put('/user/:id', protect, adminOnly, updateUser);
router.delete('/user/:id', protect, adminOnly, deleteUser);

export default router;