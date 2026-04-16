import express from 'express';
import cors from 'cors';
import sequelize from './config/db.js';
import User from './models/userModel.js'; 
import authRoutes from './routes/authRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import Client from './models/clientModel.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`🔔 Petición recibida: ${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientRoutes);

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada y conectada');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ No se pudo conectar a la base de datos:', error);
  }
};

startServer();