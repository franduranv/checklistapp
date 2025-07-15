const express = require('express');
const Unit = require('../models/Unit');
const { verifyToken } = require('./auth');
const router = express.Router();

// Obtener todas las unidades activas
router.get('/', verifyToken, async (req, res) => {
  try {
    const units = await Unit.find({ active: true })
      .select('code name category floor')
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

module.exports = router; 