const Record = require("../models/record");
const Device = require("../models/device");
const Patient = require("../models/patient");

exports.addRecord = async (req, res) => {
  const { bpm, spo2, temp, p_sys, p_dia, status, alertType } = req.body;

  // console.log(status);

  try {
    
    const newRecord = new Record({
      device: req.device._id,
      bpm,
      spo2,
      temp,
      p_sys,
      p_dia,
      status,
      alertType
    });



    await newRecord.save();
    res.status(201).json({ message: 'Registro exitoso.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
};

exports.getData = async (req, res) => {
  const { name = '' } = req.query;

  try {
    if (!name) {
      return res.status(400).json({ message: "El nombre del paciente es requerido." });
    }

    const patient = await Patient.findOne({ patientName: { $regex: name, $options: 'i' }});
    if (!patient) {
      return res.status(404).json({ message: "Paciente no encontrado." });
    }

    const devices = await Device.find({ patientName: req.query.name }).select("_id");
    const deviceIds = devices.map((device) => device._id);

    //console.log(req);
    // console.log(devices);
    // console.log(deviceIds);

    const data = await Record.find({
      device: { $in: deviceIds },
    })
      .sort({ createdAt: -1 });
      //.limit(10);

    res.json(data);
  } catch (err) {
    console.error("Error al obtener los registros:", err);
    res.status(500).send("Error en el servidor");
  }
};

