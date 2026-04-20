import express from 'express';
import { obtenerServicios, crearServicio } from '../controllers/serviceController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, obtenerServicios);
router.post('/', protect, adminOnly, crearServicio);

export default router;