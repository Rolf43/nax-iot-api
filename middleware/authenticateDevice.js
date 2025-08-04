const Device = require('../models/device');

const authenticateDevice = async (req, res, next) => {
  const token = req.headers['x-api-token'];
  if (!token) {
    return res.status(401).json({ message: 'Necesitas un token de autorización.' });
  }

  try {
    const device = await Device.findOne({ apiToken: token });
    if (!device) {
      return res.status(403).json({ message: 'Token API invalido.' });
    }
    req.device = device; // Guarda la información del dispositivo en el objeto request
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
};

module.exports = authenticateDevice;


