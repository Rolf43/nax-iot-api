const bcrypt = require('bcryptjs');

// Supongamos que estos valores vienen de la base de datos y el usuario respectivamente
const passwordIngresada = "123123";  // La contraseña que el usuario ingresa
const passwordHasheadaDB = "$2a$12$R/2DpyDtv4cSXXtjx.hEzuKn1fTmL/AIuhccKFrq5Pgzgrsg1sN1y";  // La contraseña almacenada en la base de datos

bcrypt.compare(passwordIngresada, passwordHasheadaDB, function(err, isMatch) {
    if (err) {
        throw err;
    } else if (!isMatch) {
        console.log("Contraseña incorrecta");
    } else {
        console.log("Contraseña correcta");
    }
});
