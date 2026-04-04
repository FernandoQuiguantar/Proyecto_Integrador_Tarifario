const express = require('express');
const router = express.Router();
const PrecioProveedor = require('../models/PrecioProveedor');
const Tarifa = require('../models/Tarifa');

// POST /api/precios - Crear o actualizar precio de un proveedor para una tarifa
router.post('/', async (req, res) => {
  try {
    const { tarifa_id, proveedor_email, proveedor_nombre, precio } = req.body;

    if (!tarifa_id || !proveedor_email || !precio) {
      return res.status(400).json({ message: 'tarifa_id, proveedor_email y precio son requeridos' });
    }

    if (precio <= 0) {
      return res.status(400).json({ message: 'El precio debe ser mayor a 0' });
    }

    // Buscar si ya existe un precio de este proveedor para esta tarifa
    const existente = await PrecioProveedor.findOne({
      where: { tarifa_id, proveedor_email }
    });

    if (existente) {
      await existente.update({ precio, proveedor_nombre });
      return res.json(existente);
    }

    const nuevo = await PrecioProveedor.create({
      tarifa_id, proveedor_email, proveedor_nombre, precio
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ message: 'Error al guardar precio', error: error.message });
  }
});

// GET /api/precios/proveedor/:email - Ofertas de un proveedor con centro_comercial
router.get('/proveedor/:email', async (req, res) => {
  try {
    const precios = await PrecioProveedor.findAll({
      where: { proveedor_email: req.params.email },
      include: [{ model: Tarifa, attributes: ['centro_comercial'] }],
    });
    // Agrupar conteo por centro_comercial
    const conteo = {};
    precios.forEach(p => {
      const cc = p.Tarifa?.centro_comercial || 'Sin centro';
      conteo[cc] = (conteo[cc] || 0) + 1;
    });
    res.json({ total: precios.length, por_centro: conteo });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ofertas del proveedor' });
  }
});

// GET /api/precios/:tarifa_id - Obtener todos los precios de proveedores para una tarifa
router.get('/:tarifa_id', async (req, res) => {
  try {
    const precios = await PrecioProveedor.findAll({
      where: { tarifa_id: req.params.tarifa_id },
      order: [['precio', 'ASC']],
      limit: 3
    });
    res.json(precios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener precios' });
  }
});

module.exports = router;
