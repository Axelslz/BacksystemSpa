import express from 'express';
import { agendarCita, obtenerHistorialCliente, obtenerAgenda } from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/agendar', protect, agendarCita); 
router.get('/dashboard', protect, obtenerAgenda); 
router.get('/historial/:clienteId', protect, obtenerHistorialCliente);

export default router;