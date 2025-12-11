const express = require('express');
const Checklist = require('../models/Checklist');
const Unit = require('../models/Unit');
const Template = require('../models/Template'); // Ensure Template is registered
const { verifyToken } = require('./auth');
const googleDrive = require('../services/googleDrive');
const router = express.Router();

// GET /api/checklists - Listar todos los checklists
router.get('/', verifyToken, async (req, res) => {
  try {
    const checklists = await Checklist.find()
      .populate('unit', 'code name')
      .populate('user', 'name')
      .populate('template', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: checklists
    });
  } catch (error) {
    console.error('Error obteniendo checklists:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// GET /api/checklists/:id - Detalle de un checklist
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const checklist = await Checklist.findById(req.params.id)
      .populate('unit', 'code name floor')
      .populate('user', 'name')
      .populate('template');

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: 'Checklist no encontrado'
      });
    }

    res.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Error obteniendo detalle de checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear un nuevo checklist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { unitId, templateId, items, photos, finalStatus, comments } = req.body;
    const userId = req.user.userId;

    // Validar datos mínimos
    if (!unitId || !templateId || !items || !photos || !finalStatus) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos.'
      });
    }

    // Validar unidad
    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unidad no encontrada.'
      });
    }

    // Subir fotos a Google Drive (Fotos Globales)
    const uploadedPhotos = [];
    for (const photo of photos) {
      // photo: { base64, type, description }
      const fileName = `${unit.code}_${Date.now()}_${photo.type}.jpg`;
      const uploadResult = await googleDrive.uploadBase64Image(photo.base64, fileName);
      uploadedPhotos.push({
        url: uploadResult.directLink,
        type: photo.type,
        description: photo.description || ''
      });
    }

    // Procesar fotos a nivel de item (Checklist Items)
    const processedItems = [];
    for (const item of items) {
      // Si el item tiene un valor que parece ser una foto (objeto con base64 y type='photo')

      let itemValue = item.value;

      if (itemValue && typeof itemValue === 'object' && itemValue.type === 'photo' && itemValue.base64) {
        try {
          const fileName = `${unit.code}_${Date.now()}_item_photo.jpg`;
          const uploadResult = await googleDrive.uploadBase64Image(itemValue.base64, fileName);
          itemValue = uploadResult.directLink; // Reemplazamos el objeto base64 por la URL
        } catch (uploadError) {
          console.error('Error subiendo foto de item:', uploadError);
          // Si falla, quizás guardar un error o dejar el texto vacío
          itemValue = 'Error al subir imagen';
        }
      }

      processedItems.push({
        ...item,
        value: itemValue
      });
    }

    // Crear checklist
    const checklist = new Checklist({
      user: userId,
      unit: unitId,
      template: templateId,
      items: processedItems,
      photos: uploadedPhotos,
      finalStatus,
      comments
    });
    await checklist.save();

    res.json({
      success: true,
      message: 'Checklist guardado correctamente',
      data: checklist
    });
  } catch (error) {
    console.error('Error creando checklist:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;