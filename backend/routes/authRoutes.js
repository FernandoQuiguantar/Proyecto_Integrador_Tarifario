const express = require('express');
const router = express.Router();

// Usuarios fijos del sistema
const USUARIOS = [
  { email: 'usuario1@gmail.com', password: 'prueba1', rol: 'usuario', nombre: 'Usuario 1' },
  { email: 'usuario2@gmail.com', password: 'prueba2', rol: 'usuario', nombre: 'Usuario 2' },
  { email: 'proveedor1@gmail.com', password: 'prueba1', rol: 'proveedor', nombre: 'Proveedor 1' },
  { email: 'proveedor2@gmail.com', password: 'prueba2', rol: 'proveedor', nombre: 'Proveedor 2' },
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password, rol } = req.body;

  if (!email || !password || !rol) {
    return res.status(400).json({ message: 'Email, contraseña y rol son requeridos' });
  }

  const usuario = USUARIOS.find(
    u => u.email === email && u.password === password && u.rol === rol
  );

  if (!usuario) {
    return res.status(401).json({ message: 'Credenciales inválidas o rol incorrecto' });
  }

  res.json({
    message: 'Login exitoso',
    usuario: { email: usuario.email, nombre: usuario.nombre, rol: usuario.rol }
  });
});

module.exports = router;
