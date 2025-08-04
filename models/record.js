const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  bpm: { type: Number, required: true },
  spo2: { type: Number, required: true },
  temp: { type: Number, required: true },
  p_sys: { type: Number, required: true },
  p_dia: { type: Number, required: true },
  status: { type: String, required: true }, 
  alertType: { type: String, required: true },
  recordedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);
