const express = require('express');
const router = express.Router();
const { registerPatient, editPatient, listPatients, deletePatient } = require('../controllers/patientController');
const authenticateToken = require('../middleware/authenticateToken');

// Ruta para registrar un nuevo paciente
router.post('/register',authenticateToken, registerPatient);

// Ruta para listar pacientes
router.get('/list',authenticateToken, listPatients);

// Ruta para iniciar sesión
router.delete('/:_id',authenticateToken, deletePatient);

// Ruta para editar datos del paciente
router.put('/update/:_id',authenticateToken, editPatient);

module.exports = router;