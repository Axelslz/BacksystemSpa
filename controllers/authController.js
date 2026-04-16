import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      role: role || 'empleado'
    });

    res.status(201).json({ message: "Usuario creado", role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    user.token = token;
    await user.save();

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, role: user.role }
    });
  } catch (error) {
    console.error("🔴 ERROR DETALLADO:", error);
    res.status(500).json({ message: 'Error en login', 
      error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.token = null; 
      await user.save();
    }
    res.json({ message: 'Sesión cerrada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ 
      attributes: { exclude: ['password'] } 
    });
    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: 'Error al obtener la lista' });
  }
};

// --- ACTUALIZAR USUARIO (CRUD - Update) ---
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, role, status } = req.body;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status !== undefined) user.status = status;
  
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    
    res.json({ 
      message: 'Usuario actualizado correctamente', 
      user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

// --- ELIMINAR USUARIO (CRUD - Delete) ---
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};