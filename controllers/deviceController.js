const Device = require('../models/device');
const Patient = require('../models/patient');
const crypto = require('crypto');

// exports.registerDevice = async (req, res) => {
//   const { deviceName, deviceModel, patientName, deviceStatus, registrationDate, lastCalibration } = req.body;
//   try {
//     // Primero, encuentra el usuario por su nombre de usuario
//     const patient = await patient.findOne({ patientName });
//     if (!patient) {
//       return res.status(404).json({ msg: 'Usuario no encontrado' });
//     }

//     // Verificar si el dispositivo ya está registrado
//     let device = await Device.findOne({ deviceName });
//     if (device) {
//       return res.status(400).json({ msg: 'El dispositivo ya está registrado' });
//     }

//     // Generar un token API seguro
//     const apiToken = crypto.randomBytes(20).toString('hex');

//     // Registrar el nuevo dispositivo
//     device = new Device({
//       deviceName,
//       patient: patient._id,  // Usar el ID del usuario encontrado
//       deviceModel,
//       deviceStatus,
//       registrationDate,
//       lastCalibration,
//       apiToken        // Guardar el token generado
//     });

//     await device.save();
//     res.status(201).json({ msg: 'Dispositivo registrado correctamente', device, apiToken });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Error en el servidor');
//   }
// };

// Listar dispositivos

exports.registerDevice = async (req, res) => {
  const { deviceName, deviceModel, patientName, deviceStatus, registrationDate, lastCalibration } = req.body;

  // Validación de datos
  if (!deviceName || !deviceModel || !patientName || !deviceStatus || !registrationDate || !lastCalibration) {
    return res.status(400).json({ msg: 'Todos los campos son requeridos.' });
  }

  try {
    // Encontrar el paciente por nombre de paciente
    const patient = await Patient.findOne({ patientName });
    if (!patient) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Verificar si el dispositivo ya está registrado
    let device = await Device.findOne({ deviceName });
    if (device) {
      return res.status(400).json({ msg: 'El dispositivo ya está registrado' });
    }

    // Generar un token API seguro
    const apiToken = crypto.randomBytes(20).toString('hex');
    console.log(apiToken);

    // Registrar el nuevo dispositivo
    device = new Device({
      deviceName,
      patientName,
      patient: patient._id,  // Usar el ID del usuario encontrado
      deviceModel,
      deviceStatus,
      registrationDate,
      lastCalibration,
      apiToken  // Guardar el token generado
    });

    // Guardar el dispositivo en la base de datos
    await device.save();
    res.status(201).json({ msg: 'Dispositivo registrado correctamente', device, apiToken });

  } catch (err) {
    console.error(err.message);
    // Mejor manejo de errores con detalles
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'El dispositivo ya está registrado o el token es duplicado.' });
    }
    res.status(500).send('Error en el servidor');
  }
};

exports.listDevices = async (req, res) => {
  const { buscar = '', nroReg = 10, inicioReg = 0 } = req.query;

  try {
    // Realizar la búsqueda de dispositivos con filtros
    const devices = await Device.find({ deviceName: { $regex: buscar, $options: 'i' } })
      .skip(parseInt(inicioReg))
      .limit(parseInt(nroReg));

    if (devices.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron dispositivos' });
    }

    res.status(200).json({ ok: true, data: devices });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

// Eliminar dispositivo
exports.deleteDevice = async (req, res) => {
  const { _id } = req.params;
  console.log({_id});

  try {
    // Buscar el dispositivo por su identifier
    const device = await Device.findOne({ _id });
    if (!device) {
      return res.status(404).json({ msg: 'Dispositivo no encontrado' });
    }

    // Eliminar el dispositivo
    await device.remove();
    res.status(200).json({ ok: true, msg: 'Dispositivo eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};

//Original
/*const Device = require('../models/device');
const patient = require('../models/patient');

exports.registerDevice = async (req, res) => {
  const { identifier, patientName } = req.body;
  try {
    // Primero, encuentra el usuario por correo electrónico
    const patient = await patient.findOne({ patientName });
    if (!patient) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Verificar si el dispositivo ya está registrado
    let device = await Device.findOne({ identifier });
    if (device) {
      return res.status(400).json({ msg: 'El dispositivo ya está registrado' });
    }

    // Registrar el nuevo dispositivo
    device = new Device({
      identifier,
      patient: patient._id  // Usar el ID del usuario encontrado
    });

    await device.save();
    res.status(201).json({ msg: 'Dispositivo registrado correctamente', device });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};*/
