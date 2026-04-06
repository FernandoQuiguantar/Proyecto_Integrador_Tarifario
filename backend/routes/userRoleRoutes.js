const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserRole = require('../models/UserRole');

// POST /api/roles/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son obligatorios' });

    const user = await UserRole.findByPk(email.toLowerCase().trim());
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valido = await bcrypt.compare(password, user.password);
    if (!valido) return res.status(401).json({ message: 'Credenciales inválidas' });

    res.json({ email: user.email, nombre: user.nombre, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
});

// GET /api/roles — listar todos
router.get('/', async (req, res) => {
  try {
    const roles = await UserRole.findAll({
      attributes: ['email', 'nombre', 'rol', 'createdAt'],
      order: [['email', 'ASC']],
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// POST /api/roles — crear usuario
router.post('/', async (req, res) => {
  try {
    const { email, password, rol, nombre } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña son obligatorios' });

    const existe = await UserRole.findByPk(email.toLowerCase().trim());
    if (existe) return res.status(409).json({ message: 'Ya existe un usuario con ese correo' });

    const hash = await bcrypt.hash(password, 10);
    const user = await UserRole.create({ email: email.toLowerCase().trim(), password: hash, rol: rol || 'visor', nombre });
    res.status(201).json({ email: user.email, nombre: user.nombre, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

// PUT /api/roles/:email — actualizar rol o contraseña
router.put('/:email', async (req, res) => {
  try {
    const user = await UserRole.findByPk(decodeURIComponent(req.params.email));
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const updates = {};
    if (req.body.rol) updates.rol = req.body.rol;
    if (req.body.nombre !== undefined) updates.nombre = req.body.nombre;
    if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);

    await user.update(updates);
    res.json({ email: user.email, nombre: user.nombre, rol: user.rol });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

// DELETE /api/roles/:email — eliminar usuario
router.delete('/:email', async (req, res) => {
  try {
    await UserRole.destroy({ where: { email: decodeURIComponent(req.params.email) } });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

module.exports = router;
