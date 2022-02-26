const dbvalidator = require('./db-validators');
const googleVerify = require('./google-verify');
const generarJWT = require('./generarJWT');
const SubirArchivo = require('./subir.archivo');

module.exports = {

    ...dbvalidator,
    ...googleVerify,
    ...generarJWT,
    ...SubirArchivo
}

