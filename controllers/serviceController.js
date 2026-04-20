import Service from '../models/serviceModel.js';

// Obtener todos los servicios activos
export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Service.findAll({ where: { status: true } });
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicios' });
  }
};

// Crear un servicio (esto lo usaría el admin)
export const crearServicio = async (req, res) => {
  try {
    const nuevoServicio = await Service.create(req.body);
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear servicio' });
  }
};