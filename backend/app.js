const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sequelize = require('./config/db');
const tarifaRoutes = require('./routes/tarifaRoutes');
const authRoutes = require('./routes/authRoutes');
const precioProveedorRoutes = require('./routes/precioProveedorRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const opcionesRoutes = require('./routes/opcionesRoutes');
require('./models/PrecioProveedor');
require('./models/Proveedor');
require('./models/UserRole');

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

// Health check (sin DB)
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    vercel: !!process.env.VERCEL,
    hasDb: !!process.env.DATABASE_URL,
    node: process.version,
  });
});

// Rutas
app.use('/api/tarifas', tarifaRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/precios', precioProveedorRoutes);
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/roles', userRoleRoutes);
app.use('/api/opciones', opcionesRoutes);

// En Vercel (serverless) solo exportamos el app sin listen ni sync
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;

  async function iniciarServidor() {
    try {
      await sequelize.query(`
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = 'user_roles'
              AND column_name = 'rol'
              AND udt_name LIKE 'enum_%'
          ) THEN
            ALTER TABLE user_roles ALTER COLUMN rol TYPE VARCHAR(20) USING rol::TEXT;
          END IF;
        END $$;
      `);
      await sequelize.sync({ alter: true });
      app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
    } catch (err) {
      console.error('Error conectando a la DB:', err.message);
    }
  }

  iniciarServidor();
}

module.exports = app;