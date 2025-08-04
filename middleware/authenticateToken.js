const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send('No tienes un token.');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send('Autenticación de token fallida.');
        }
        req.user = decoded; // Asegúrate de que el payload del token incluya un campo 'id'
        next();
    });
};

module.exports = authenticateToken;

