import User from './userModel.js';
import Service from './serviceModel.js';

// Un Usuario (Empleado) puede tener muchos Servicios
User.belongsToMany(Service, { 
  through: 'UsuarioServicios', // Sequelize creará esta tabla intermedia en tu BD
  as: 'servicios',             // Alias para cuando hagamos consultas
  foreignKey: 'userId'
});

// Un Servicio puede ser realizado por muchos Usuarios (Empleados)
Service.belongsToMany(User, { 
  through: 'UsuarioServicios',
  as: 'especialistas',
  foreignKey: 'serviceId'
});

export { User, Service };