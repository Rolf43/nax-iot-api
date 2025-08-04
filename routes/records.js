const express = require("express");
const router = express.Router();
const { getData, addRecord } = require("../controllers/recordController");
const authenticateToken = require("../middleware/authenticateToken"); // Importa el middleware
const authenticateDevice = require("../middleware/authenticateDevice");//Prueba

// Rutas protegidas usando el middleware de autenticación
router.get("/data", authenticateToken, getData); // Aplica el middleware a esta ruta
//router.post("/", authenticateToken, addRecord);
router.post("/add", authenticateDevice, addRecord); // Aplica el middleware a esta ruta

module.exports = router;