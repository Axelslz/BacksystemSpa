import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ message: 'No hay token en la petición' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: 'Sesión inválida o expirada' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("🔴 Error Middleware:", error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Requieres ser Admin' });
};