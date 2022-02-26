
 
const validarJWS = require('../middlewares/validar-jwt');
const valicarRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');
const validarArchivo = require('./validar-archivo');


module.exports = {
    ...validarJWS,
    ...valicarRoles,
    ...validarCampos,
    ...validarArchivo
}