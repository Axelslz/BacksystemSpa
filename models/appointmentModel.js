import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Client from './clientModel.js';
import User from './userModel.js';
import Service from './serviceModel.js';

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fecha: {
    type: DataTypes.DATEONLY, // Solo YYYY-MM-DD
    allowNull: false
  },
  hora: {
    type: DataTypes.TIME, // Solo HH:MM:SS
    allowNull: false
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pendiente', 'Completada', 'Cancelada'),
    defaultValue: 'Pendiente'
  }
}, {
  tableName: 'citas',
  timestamps: true
});

Appointment.belongsTo(Client, { foreignKey: 'clienteId', as: 'cliente' });
Appointment.belongsTo(User, { foreignKey: 'especialistaId', as: 'especialista' });
Appointment.belongsTo(Service, { foreignKey: 'servicioId', as: 'servicio' });

export default Appointment;