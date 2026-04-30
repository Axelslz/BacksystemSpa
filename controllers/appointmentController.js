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
        { model: Service, as: 'servicio', attributes: ['nombre', 'precio', 'duracionMinutos'] },
        { model: User, as: 'especialista', attributes: ['nombre'] } 
      ],
      order: [['hora', 'ASC']]
    });

    res.json(agenda);
  } catch (error) {
    console.error("Error al cargar la agenda:", error); 
    res.status(500).json({ message: 'Error al cargar la agenda' });
  }
};

export const actualizarEstadoCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const estadosValidos = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
    if (!estadosValidos.includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }

    const cita = await Appointment.findByPk(id);
    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    cita.status = status;
    await cita.save();

    res.json({ message: 'Estado actualizado correctamente', cita });
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    res.status(500).json({ message: 'Error al actualizar el estado de la cita' });
  }
};

export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, servicioId, especialistaId, observaciones } = req.body;

    const cita = await Appointment.findByPk(id);

    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    await cita.update({
      fecha: fecha || cita.fecha,
      hora: hora || cita.hora,
      servicioId: servicioId || cita.servicioId,
      especialistaId: especialistaId || cita.especialistaId,
      observaciones: observaciones !== undefined ? observaciones : cita.observaciones
    });

    res.json({ message: 'Cita actualizada correctamente', cita });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).json({ message: 'Error interno al actualizar la cita' });
  }
};