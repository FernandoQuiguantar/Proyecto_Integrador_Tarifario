const express = require('express');
const router = express.Router();
const Proveedor = require('../models/Proveedor');

// POST /api/proveedores - Registrar un nuevo proveedor
router.post('/', async (req, res) => {
  try {
    const { ruc, razon_social, correo, numero_contacto } = req.body;

    if (!ruc || !razon_social || !correo || !numero_contacto) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevo = await Proveedor.create({ ruc, razon_social, correo, numero_contacto });
    res.status(201).json(nuevo);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un proveedor con ese RUC' });
    }
    res.status(500).json({ message: 'Error al registrar proveedor', error: error.message });
  }
});

// GET /api/proveedores - Listar todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({ order: [['razon_social', 'ASC']] });
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores' });
  }
});

// PUT /api/proveedores/:id - Actualizar proveedor
router.put('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    const { ruc, razon_social, correo, numero_contacto } = req.body;
    await proveedor.update({ ruc, razon_social, correo, numero_contacto });
    res.json(proveedor);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe un proveedor con ese RUC' });
    }
    res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
  }
});

// DELETE /api/proveedores/:id - Eliminar proveedor
router.delete('/:id', async (req, res) => {
  try {
    const proveedor = await Proveedor.findByPk(req.params.id);
    if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
    await proveedor.destroy();
    res.json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
  }
});

module.exports = router;
