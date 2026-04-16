import express from 'express';
import { registrarCliente, obtenerTodos, buscarCliente } from '../controllers/clientController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', protect, registrarCliente);
router.get('/todos', protect, obtenerTodos);
router.get('/buscar', protect, buscarCliente);


export default router;