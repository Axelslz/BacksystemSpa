import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'empleado'),
    defaultValue: 'empleado',
    allowNull: false
  },
  token: {
    type: DataTypes.TEXT, 
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true 
  }
}, {
  tableName: 'usuarios' 
});

export default User;