const express = require('express');

const { requireAdmin } = require('../middleware/authAdmin');
const {
  createMaterial,
  listMaterials,
  getMaterialById,
  deleteMaterial,
} = require('../controllers/materialController');

const router = express.Router();

// Admin upload
router.post('/upload', requireAdmin, createMaterial);

// Public list
router.get('/materials', listMaterials);

// Public get by id
router.get('/materials/:id', getMaterialById);

// Admin delete
router.delete('/materials/:id', requireAdmin, deleteMaterial);

module.exports = router;

