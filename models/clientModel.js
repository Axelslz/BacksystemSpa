import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  codigoUnico: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Activo', 'Nuevo', 'Inactivo'),
    defaultValue: 'Nuevo'
  }
}, {
  tableName: 'clientes',
  timestamps: true
});

export default Client;