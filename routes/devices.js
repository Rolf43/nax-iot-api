const express = require('express');
const router = express.Router();
const { registerDevice, listDevices, deleteDevice } = require('../controllers/deviceController');
const authenticateToken = require('../middleware/authenticateToken');

// Registrar un dispositivo
router.post('/register', authenticateToken, registerDevice);

// Listar dispositivos
router.get('/list', authenticateToken, listDevices);

// Eliminar un dispositivo
router.delete('/:_id', authenticateToken, deleteDevice);

module.exports = router;
