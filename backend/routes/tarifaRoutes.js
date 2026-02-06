const express = require('express');
const router = express.Router();
const Tarifa = require('../models/Tarifa'); // Asegúrate de que la ruta al modelo sea correcta

// 1. Obtener todas las piezas (GET)
router.get('/', async (req, res) => {
    try {
        const tarifas = await Tarifa.findAll({ order: [['createdAt', 'DESC']] });
        res.json(tarifas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener datos" });
    }
});

// 2. Crear nueva pieza 
router.post('/', async (req, res) => {
    try {
        const { 
            pieza, 
            ancho, 
            alto, 
            profundidad, 
            unidad, 
            precio_base, 
            categoria, 
            imagen_url 
        } = req.body;

        const nuevaTarifa = await Tarifa.create({
            pieza,
            ancho,
            alto,
            profundidad,
            unidad,
            precio_base,
            categoria,
            imagen_url
        });

        res.status(201).json(nuevaTarifa);
    } catch (error) {
        res.status(400).json({ message: "Error al registrar", error: error.message });
    }
});

// 3. Actualizar pieza (PUT)
router.put('/:id', async (req, res) => {
    try {
        const tarifa = await Tarifa.findByPk(req.params.id);
        if (!tarifa) {
            return res.status(404).json({ message: "Tarifa no encontrada" });
        }
        await tarifa.update(req.body);
        res.json(tarifa);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
});

// 4. Eliminar pieza (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        await Tarifa.destroy({ where: { id: req.params.id } });
        res.json({ message: "Eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
});

module.exports = router;