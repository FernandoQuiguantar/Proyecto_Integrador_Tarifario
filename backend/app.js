const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const sequelize = require('./config/db');
const tarifaRoutes = require('./routes/tarifaRoutes');
const authRoutes = require('./routes/authRoutes');
const precioProveedorRoutes = require('./routes/precioProveedorRoutes');
require('./models/PrecioProveedor');

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta de imágenes subidas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// Endpoint de carga de imágenes
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se recibió archivo' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Rutas
app.use('/api/tarifas', tarifaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/precios', precioProveedorRoutes);

// Sincronización con BD
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
}).catch(err => console.error('Error conectando a la DB:', err));