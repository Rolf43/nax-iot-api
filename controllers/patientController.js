const Patient = require('../models/patient');

// Función para registrar un nuevo paciente
exports.registerPatient = async (req, res) => {
    const { patientName, age, height, weight, gender, imagenBase64, imagenName } = req.body;

    console.log(req.body);

    // Validación de datos
    if (!patientName || !age || !weight || !height || !gender) {
        return res.status(400).json({ msg: 'Todos los campos son requeridos.' });
    }

    try {
        // Verificar si el usuario ya existe
        let patient = await Patient.findOne({ patientName });
        if (patient) {
            return res.status(400).json({ msg: 'El paciente ya existe' });
        }

        // Crear un nuevo usuario
        patient = new Patient({
            patientName,
            age,
            weight,
            height,
            gender,
            imagen: imagenBase64 ? [{ name: imagenName, imagenBase64 }] : []
        });

        await patient.save();

        // Enviar una respuesta indicando que el registro fue exitoso
        res.status(201).json({ msg: 'Paciente registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        // Mejor manejo de errores con detalles
        if (err.code === 11000) {
        return res.status(400).json({ msg: 'El paciente ya está registrado o el token es duplicado.' });
        }
        res.status(500).send('Error en el servidor');
    }
};


// Función para editar información del paciente
exports.editPatient = async (req, res) => {
    const { patientName, age, weight, height, gender, imagenBase64, imagenName } = req.body;

    // Validación de datos
    if (!patientName || !age || !weight || !height || !gender) {
        return res.status(400).json({ msg: 'Todos los campos son requeridos.' });
    }

    try {
        // Verificar si el paciente ya existe
        let patient = await Patient.findOne({ patientName });
        if (!patient) {
            return res.status(400).json({ msg: 'El paciente no existe' });
        }

        // Actualizar los campos del paciente con los nuevos datos
        patient.age = age;
        patient.weight = weight;
        patient.height = height;
        patient.gender = gender;

        // Actualizar la imagen si se proporciona
        if (imagenBase64) {
            patient.imagen = [{ name: imagenName, imagenBase64 }];
        }

        // Guardar los cambios en la base de datos
        await patient.save();

        // Enviar una respuesta indicando que el registro fue exitoso
        res.status(200).json({ msg: 'Paciente actualizado exitosamente' });
    } catch (err) {
        console.error(err.message);
        // Mejor manejo de errores con detalles
        if (err.code === 11000) {
        return res.status(400).json({ msg: 'El paciente ya está registrado o el token es duplicado.' });
        }
        res.status(500).send('Error en el servidor');
    }
};

exports.listPatients = async (req, res) => {
  const { buscar = '', nroReg = 10, inicioReg = 0 } = req.query;

  try {
    // Realizar la búsqueda de pacientes con filtros
    const patients = await Patient.find({ patientName: { $regex: buscar, $options: 'i' } })
      .skip(parseInt(inicioReg))
      .limit(parseInt(nroReg));

    if (patients.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron pacientes.', data: [] });
    }

    res.status(200).json({ ok: true, data: patients || [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, msg: 'Error en el servidor', data: [] });
  }
};

// Eliminar dispositivo
exports.deletePatient = async (req, res) => {
  const { _id } = req.params;

  try {
    // Buscar el dispositivo por su identifier
    const patient = await Patient.findOne({ _id });
    if (!patient) {
      return res.status(404).json({ msg: 'Paciente no encontrado' });
    }

    // Eliminar el dispositivo
    await patient.remove();
    res.status(200).json({ ok: true, msg: 'Paciente eliminado correctamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
};