let tokenBlacklist = [];

const checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token && tokenBlacklist.includes(token)) {
        return res.status(401).json({ msg: 'Este token ha sido revocado.' });
    }
    next();
};

module.exports = {
    checkBlacklist,
    tokenBlacklist  // Exportar para poder modificar la lista desde otros lugares
};
