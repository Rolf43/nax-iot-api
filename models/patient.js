const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    patientName: { type: String, required: true, unique: true },
    age:{type: Number, required:true},
    weight:{type: Number, required: true},
    height:{type: Number, required: true},
    gender:{type: String, required: true},
    imagen:[{name: { type: String, required: true }, imagenBase64: { type: String, required: true }}]
});

module.exports = mongoose.model('Patient', PatientSchema);