const express = require('express');
const router = express.Router();
const { register, login, me, logout, update } = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

// Ruta para registrar un nuevo usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para iniciar sesión
router.get('/me',authenticateToken, me);

// Ruta para cerrar sesión
router.post('/logout',authenticateToken, logout);

// Ruta para editar datos del usuario
router.put('/update',authenticateToken, update);

module.exports = router;
