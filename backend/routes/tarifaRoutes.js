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

        const existente = await Tarifa.findOne({ where: { codigo, cotizacion_tipo } });
        if (existente) {
            return res.status(409).json({ message: `Ya existe '${codigo}' con tipo '${cotizacion_tipo}'. Use un código o tipo diferente.` });
        }

        const nueva = await Tarifa.create({ codigo, pieza, cotizacion_tipo, descripcion_material, medida, unidad, cantidad, categoria, centro_comercial, imagen_url });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ message: "Error al registrar", error: error.message });
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
