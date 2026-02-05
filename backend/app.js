const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const tarifaRoutes = require('./routes/tarifaRoutes'); 

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/tarifas', tarifaRoutes);

// Sincronización con Docker
const PORT = 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}).catch(err => console.error('Error conectando a la DB:', err));