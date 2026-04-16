import Client from '../models/clientModel.js';
import { Op } from 'sequelize';

const generarCodigoSpa = (nombre) => {
  const prefijo = "SPA-";
  const inicial = nombre.charAt(0).toUpperCase();
  const aleatorio = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `${prefijo}${inicial}${aleatorio}`;
};

export const registrarCliente = async (req, res) => {
  try {
    const { nombreCompleto, telefono, email } = req.body;
    
    const codigo = generarCodigoSpa(nombreCompleto);

    const nuevoCliente = await Client.create({
      nombreCompleto,
      telefono,
      email,
      codigoUnico: codigo,
      status: 'Nuevo'
    });

    res.status(201).json({
      message: '¡Bienvenido a la Familia!',
      cliente: nombreCompleto,
      codigoUnico: codigo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al generar alta', error: error.message });
  }
};

export const obtenerTodos = async (req, res) => {
  try {
    const clientes = await Client.findAll({ order: [['createdAt', 'DESC']] });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener clientes' });
  }
};

export const buscarCliente = async (req, res) => {
  try {
    const { q } = req.query; 
    const clientes = await Client.findAll({
      where: {
        [Op.or]: [
          { nombreCompleto: { [Op.like]: `%${q}%` } },
          { codigoUnico: { [Op.like]: `%${q}%` } }
        ]
      }
    });
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: 'Error en la búsqueda' });
  }
};