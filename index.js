const mongoose = require('mongoose');
const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  IP_SERVER,
  API_VERSION,
} = require('./constante');

// URI de conexión
const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;

// Conectar a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((error) => {
    console.error('❌ Error MongoDB:', error.message);
    process.exit(1);
  });

// Configurar Express
const express = require("express");
const app = express();

// Importar rutas
const authRoutes = require("./router/auth");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rutas
app.use(`/api/${API_VERSION}`, authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3977;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://${IP_SERVER}:${PORT}`);
    console.log(`📡 API: http://${IP_SERVER}:${PORT}/api/${API_VERSION}`);
});