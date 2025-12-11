const express = require('express');
const router = express.Router();
const Template = require('../models/Template');
const auth = require('./auth'); // Assuming auth middleware exists

// GET /api/templates - Listar todos los templates
router.get('/', async (req, res) => {
    try {
        const templates = await Template.find().sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/templates - Crear nuevo template
router.post('/', async (req, res) => {
    try {
        const template = new Template(req.body);
        const newTemplate = await template.save();
        res.status(201).json(newTemplate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET /api/templates/:id - Obtener un template específico
router.get('/:id', async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /api/templates/:id - Actualizar template
router.put('/:id', async (req, res) => {
    try {
        const template = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json(template);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /api/templates/:id - Eliminar template
router.delete('/:id', async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id);
        if (!template) return res.status(404).json({ message: 'Template not found' });
        res.json({ message: 'Template deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
