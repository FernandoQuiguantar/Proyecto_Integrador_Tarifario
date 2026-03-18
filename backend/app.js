const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sequelize = require('./config/db');
const tarifaRoutes = require('./routes/tarifaRoutes');
const authRoutes = require('./routes/authRoutes');
const precioProveedorRoutes = require('./routes/precioProveedorRoutes');
require('./models/PrecioProveedor');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer en memoria (no guarda en disco)
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint de carga de imágenes → sube a Cloudinary
app.post('/api/upload', upload.single('imagen'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se recibió archivo' });
  try {
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tarifario_smo' },
        (error, result) => error ? reject(error) : resolve(result)
      );
      stream.end(req.file.buffer);
    });
    res.json({ url: resultado.secure_url });
  } catch (err) {
    res.status(500).json({ message: 'Error al subir imagen a Cloudinary' });
  }
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