const express = require('express');
const Checklist = require('../models/Checklist');
const Unit = require('../models/Unit');
const { verifyToken } = require('./auth');
const googleDrive = require('../services/googleDrive');
const router = express.Router();

// Crear un nuevo checklist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { unitId, items, photos, finalStatus, comments } = req.body;
    const userId = req.user.userId;

    // Validar datos mínimos
    if (!unitId || !items || !photos || !finalStatus) {
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

    // Subir fotos a Google Drive
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

    // Crear checklist
    const checklist = new Checklist({
      user: userId,
      unit: unitId,
      items,
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