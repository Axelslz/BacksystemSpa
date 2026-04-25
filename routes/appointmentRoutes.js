import express from 'express';
import { agendarCita, obtenerHistorialCliente, obtenerAgenda, actualizarEstadoCita } from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/agendar', protect, agendarCita); 
router.get('/dashboard', protect, obtenerAgenda); 
router.get('/historial/:clienteId', protect, obtenerHistorialCliente);
router.patch('/estado/:id', protect, actualizarEstadoCita);

export default router;