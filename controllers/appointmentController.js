import Appointment from '../models/appointmentModel.js';
import Client from '../models/clientModel.js';
import Service from '../models/serviceModel.js';
import User from '../models/userModel.js';

export const agendarCita = async (req, res) => {
  try {

    const { clienteId, especialistaId, servicioId, fecha, hora, observaciones } = req.body;

    if (!clienteId || !especialistaId || !servicioId || !fecha || !hora) {
      return res.status(400).json({ message: 'Faltan datos obligatorios para la cita' });
    }

    const nuevaCita = await Appointment.create({
      clienteId,
      especialistaId,
      servicioId,
      fecha,
      hora,
      observaciones,
      status: 'Pendiente'
    });

    res.status(201).json({
      message: 'Cita agendada con éxito',
      cita: nuevaCita
    });

  } catch (error) {
    console.error("Error al agendar cita:", error);
    res.status(500).json({ message: 'Error interno del servidor al agendar' });
  }
};

export const obtenerHistorialCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;

    const historial = await Appointment.findAll({
      where: { 
        clienteId,
        status: 'Completada' 
      },
      include: [
        { model: Service, as: 'servicio', attributes: ['nombre', 'precio'] },
        { model: User, as: 'especialista', attributes: ['nombre'] }
      ],
      order: [['fecha', 'DESC'], ['hora', 'DESC']] 
    });

    const historialFormateado = historial.map(cita => ({
      fecha: cita.fecha,
      servicio: cita.servicio.nombre,
      costo: cita.servicio.precio,
      observaciones: cita.observaciones || 'Sin observaciones.'
    }));

    res.json(historialFormateado);

  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
};

export const obtenerAgenda = async (req, res) => {
  try {
    const { role, id } = req.user; 
    const { fecha } = req.query; 

    let filtro = {};

    if (role !== 'admin') {
      filtro.especialistaId = id;
    }

    if (fecha) {
      filtro.fecha = fecha;
    }

    const agenda = await Appointment.findAll({
      where: filtro,
      include: [
        { model: Client, as: 'cliente', attributes: ['nombreCompleto', 'telefono', 'codigoUnico'] },
        { model: Service, as: 'servicio', attributes: ['nombre', 'precio', 'duracionMinutos'] }
      ],
      order: [['hora', 'ASC']]
    });

    res.json(agenda);
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar la agenda' });
  }
};