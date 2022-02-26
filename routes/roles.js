const { Router } = require('express');
const { check } = require('express-validator');


const { obtenerRoles, crearRol, actualizarRol, eliminarRol, obtenerRol } = require('../controllers/roles');
const { existeRolporID } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router();

//Obtener todos los roles
router.get('/' , obtenerRoles)

//Obtener Rol
router.get('/:id',
[
    check('id',"El id del rol no es ID valido").isMongoId() ,
    check('id').custom( existeRolporID ),
    validarCampos
]
, obtenerRol )


//Crear Rol
router.post('/',
[
    // validarJWT,
    check( "rol","El nombre es obligatorio" ).not().isEmpty(),
    validarCampos
]
, crearRol)


//Actualizar Rol
router.put('/:id',
[
    validarJWT,
    check('id',"El id del rol no es ID valido").isMongoId() ,
    check('id').custom( existeRolporID ),
    validarCampos
]
, actualizarRol)



//Delete Rol
router.delete('/:id',
[
    validarJWT,
    esAdminRole,
    check('id',"El id del rol no es ID valido").isMongoId() ,
    check('id').custom( existeRolporID ),
    validarCampos
]
, eliminarRol)


module.exports = router;