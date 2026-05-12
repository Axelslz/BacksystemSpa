import express from 'express';
import { agendarCita, obtenerHistorialCliente, obtenerAgenda, actualizarEstadoCita, actualizarCita, obtenerHorariosDisponibles, obtenerEstadisticas } from '../controllers/appointmentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/agendar', protect, agendarCita); 
router.get('/dashboard', protect, obtenerAgenda); 
router.get('/historial/:clienteId', protect, obtenerHistorialCliente);
router.patch('/estado/:id', protect, actualizarEstadoCita);
router.put('/:id', protect, actualizarCita);
router.get('/horarios-disponibles', protect, obtenerHorariosDisponibles);
router.get('/estadisticas', protect, obtenerEstadisticas);

export default router;