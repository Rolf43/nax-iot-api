require('dotenv').config(); // Para manejar variables de entorno
const express = require('express');
const connectDB = require('./config/db'); // Archivo de conexión a la base de datos
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar rutas
const { checkBlacklist } = require('./middleware/checkBlacklist');
const userRoutes = require('./routes/users');
const recordRoutes = require('./routes/records');
const deviceRoutes = require('./routes/devices');
const patientsRoutes = require('./routes/patients');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear el cuerpo de las solicitudes en JSON
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: '*', // Asegúrate de que esta URL coincida con la del frontend
  })); // Esto permitirá todas las solicitudes CORS, puedes configurarlo para restringirlo si es necesario.

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/records', checkBlacklist, recordRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/patients', patientsRoutes);

// Definir el puerto y arrancar el servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
