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

