const express = require('express');
const router = express.Router();
const { fn, col, Op } = require('sequelize');
const Tarifa = require('../models/Tarifa');

const TIPOS_DEFAULT = ['Brandeo', 'Comprar Nuevo', 'Mantenimiento', 'Nuevo', 'Servicio'];
const CATEGORIAS_DEFAULT = ['Elemento iluminado', 'Estructura física', 'Material impreso', 'Piezas por metro cuadrado', 'Servicio'];

router.get('/cotizacion_tipo', async (req, res) => {
  try {
    const rows = await Tarifa.findAll({
      attributes: [[fn('DISTINCT', col('cotizacion_tipo')), 'valor']],
      where: { cotizacion_tipo: { [Op.ne]: null } },
      raw: true,
    });
    const fromDb = rows.map(r => r.valor).filter(Boolean);
    const all = [...new Set([...TIPOS_DEFAULT, ...fromDb])].sort();
    res.json(all);
  } catch {
    res.json(TIPOS_DEFAULT);
  }
});

router.get('/categoria', async (req, res) => {
  try {
    const rows = await Tarifa.findAll({
      attributes: [[fn('DISTINCT', col('categoria')), 'valor']],
      where: { categoria: { [Op.ne]: null } },
      raw: true,
    });
    const fromDb = rows.map(r => r.valor).filter(Boolean);
    const all = [...new Set([...CATEGORIAS_DEFAULT, ...fromDb])].sort();
    res.json(all);
  } catch {
    res.json(CATEGORIAS_DEFAULT);
  }
});

module.exports = router;
