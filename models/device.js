const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true, unique: true },
  patientName: {type: String, required: true},
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deviceModel: { type: String, required: true },
  deviceStatus: { type: String, required: true, enum: ['Activo', 'Inactivo','Mantenimiento'] },
  registrationDate: { type: Date, required: true },
  lastCalibration: { type: Date, required: true },
  apiToken: { type: String, required: true, unique: true }//PRUEBA
});

module.exports = mongoose.model('Device', DeviceSchema);
