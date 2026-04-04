const express = require('express');
const router = express.Router();
const Tarifa = require('../models/Tarifa');

// GET /api/tarifas - Obtener todas las tarifas
router.get('/', async (req, res) => {
    try {
        const tarifas = await Tarifa.findAll({ order: [['codigo', 'ASC'], ['cotizacion_tipo', 'ASC']] });
        res.json(tarifas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos" });
    }
});

// POST /api/tarifas - Crear nueva cotizacion para un articulo
router.post('/', async (req, res) => {
    try {
        const { codigo, pieza, cotizacion_tipo, descripcion_material, medida, unidad, cantidad, categoria, centro_comercial, imagen_url } = req.body;

        if (!codigo) return res.status(400).json({ message: "El código es obligatorio" });
        if (!pieza) return res.status(400).json({ message: "El nombre de la pieza es obligatorio" });
        if (!cotizacion_tipo) return res.status(400).json({ message: "El tipo de cotización es obligatorio" });

        const whereClause = centro_comercial
            ? { codigo, cotizacion_tipo, centro_comercial }
            : { codigo, cotizacion_tipo };
        const existente = await Tarifa.findOne({ where: whereClause });
        if (existente) {
            return res.status(409).json({ message: `Ya existe '${codigo}' con tipo '${cotizacion_tipo}' en '${centro_comercial || 'sin centro'}'. Use un código o tipo diferente.` });
        }

        const nueva = await Tarifa.create({ codigo, pieza, cotizacion_tipo, descripcion_material, medida, unidad, cantidad, categoria, centro_comercial, imagen_url });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ message: "Error al registrar", error: error.message });
    }
});

// POST /api/tarifas/sync-imagenes - Propaga imagen_url entre items del mismo código y centro
router.post('/sync-imagenes', async (req, res) => {
  try {
    const tarifas = await Tarifa.findAll();

    // Agrupar por (codigo, centro_comercial)
    const grupos = {};
    tarifas.forEach(t => {
      const key = `${t.codigo}||${t.centro_comercial || ''}`;
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(t);
    });

    let actualizados = 0;
    for (const grupo of Object.values(grupos)) {
      const conImagen = grupo.find(t => t.imagen_url && t.imagen_url.trim() !== '');
      if (!conImagen) continue;
      for (const t of grupo) {
        if (!t.imagen_url || t.imagen_url.trim() === '') {
          await t.update({ imagen_url: conImagen.imagen_url });
          actualizados++;
        }
      }
    }

    res.json({ actualizados, message: `${actualizados} tarifa(s) actualizada(s) con imagen.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al sincronizar imágenes', error: error.message });
  }
});

// PUT /api/tarifas/:id
router.put('/:id', async (req, res) => {
    try {
        const tarifa = await Tarifa.findByPk(req.params.id);
        if (!tarifa) return res.status(404).json({ message: "Tarifa no encontrada" });
        await tarifa.update(req.body);
        res.json(tarifa);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
});

// DELETE /api/tarifas/:id
router.delete('/:id', async (req, res) => {
    try {
        await Tarifa.destroy({ where: { id: req.params.id } });
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
});

module.exports = router;
