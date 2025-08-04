const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../middleware/checkBlacklist');

// Función para registrar un nuevo usuario
exports.register = async (req, res) => {
    const { username, email, password, gender, age, weight, height } = req.body;
    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear un nuevo usuario
        user = new User({
            username,
            email,
            password
        });

        // Hashear la contraseña antes de guardar el usuario
        user.password = await user.encryptPassword(password);

        await user.save();

        // Enviar una respuesta indicando que el registro fue exitoso
        res.status(201).json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
};


// Función para iniciar sesión
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Usuario no encontrado' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Contraseña incorrecta' });
        }

        const payload = {
            user: {
                id: user._id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            console.log(payload.user)
            res.json({ token });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
};

exports.me = async(req, res) =>{
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        const { id } = req.user.user;
        try {
            // Buscar el usuario por ID
            let user = await User.findById(id);

            // Verificar si el usuario existe
            if (!user) {
                return res.status(404).json({ msg: 'Usuario no identificado' });
            }

            const uName= user.username;
            // Enviar una respuesta indicando que la actualización fue exitosa
            res.status(200).json(uName);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error en el servidor');
        }
    } else {
        res.status(400).json({ msg: 'No se proporcionó token.' });
    }
};

exports.logout = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        tokenBlacklist.push(token);  // Agregar el token a la lista negra
        res.status(200).json({ msg: 'Sesión cerrada correctamente.' });
    } else {
        res.status(400).json({ msg: 'No se proporcionó token.' });
    }
};

exports.update = async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        tokenBlacklist.push(token);  // Agregar el token a la lista negra
        const { id } = req.user.user; // Obtenemos el ID del usuario desde los parámetros de la URL
        const { username, email } = req.body; // Nuevos datos desde el cuerpo de la solicitud

        try {
            // Buscar el usuario por ID
            let user = await User.findById(id);

            // Verificar si el usuario existe
            if (!user) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            // Verificar duplicados para username y email si se actualizan
            if (username && username !== user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ msg: 'Nombre de usuario ya en uso' });
                }
            }

            if (email && email !== user.email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    return res.status(400).json({ msg: 'Email ya en uso' });
                }
            }

            // Actualizar los campos del usuario con los nuevos datos
            user.username = username || user.username;
            user.email = email || user.email;
            // Guardar los cambios en la base de datos
            await user.save();

            // Enviar una respuesta indicando que la actualización fue exitosa
            res.status(200).json({ msg: 'Usuario actualizado exitosamente', user });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Error en el servidor');
        }
    } else {
        res.status(400).json({ msg: 'No se proporcionó token.' });
    }
};