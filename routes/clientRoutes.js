import express from 'express';
import { registrarCliente, obtenerTodos, buscarCliente,actualizarCliente, eliminarCliente } from '../controllers/clientController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/registro', protect, registrarCliente);
router.get('/todos', protect, obtenerTodos);
router.get('/buscar', protect, buscarCliente);
router.put('/:id', protect, actualizarCliente);
router.delete('/:id', protect, eliminarCliente);


export default router;