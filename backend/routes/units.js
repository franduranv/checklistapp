const express = require('express');
const Unit = require('../models/Unit');
const { verifyToken } = require('./auth');
const router = express.Router();

// Obtener todas las unidades activas
router.get('/', verifyToken, async (req, res) => {
  try {
    const units = await Unit.find({ active: true })
      .populate('defaultTemplate', 'name')
      .sort('code');

    res.json({
      success: true,
      data: units
    });
  } catch (error) {
    console.error('Error obteniendo unidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener unidades por categoría
router.get('/category/:category', verifyToken, async (req, res) => {
  try {
    const { category } = req.params;

    if (!['short-term', 'long-term'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Categoría inválida'
      });
    }

    const units = await Unit.find({
      category: category,
      active: true
    })
      .select('code name category floor')
      .sort('code');

    res.json({
      success: true,
      data: units
    });
  } catch (error) {
    console.error('Error obteniendo unidades por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// POST /api/units - Crear unidad
router.post('/', verifyToken, async (req, res) => {
  try {
    // Solo admin puede crear (si tuvieras roles, verificar aquí req.user.role)
    const newUnit = new Unit(req.body);
    await newUnit.save();
    res.status(201).json({
      success: true,
      data: newUnit
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/units/:id - Eliminar (soft delete)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const unit = await Unit.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unidad no encontrada' });
    }
    res.json({ success: true, message: 'Unidad eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;