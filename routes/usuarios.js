const { Router } = require( 'express' );
const { check } = require('express-validator');

const { esRoleValido, emailExiste, existeUsuariPorId } = require('../helpers/db-validators');

const { usuariosGet, 
        usuariosPut,
        usuariosPath,
        usuariosDelete, 
        usuariosPost} = require('../controllers/usuarios');
        
const { validarJWT,
        esAdminRole,
        tieneRole,
        validarCampos } = require('../middlewares');

// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
// const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();


router.get('/', usuariosGet);

router.put('/:id',
[
        check('id',"El id del usuario no es ID valido").isMongoId(),
        check('id').custom(existeUsuariPorId),
        check('rol',"El rol es obligatorio").not().isEmpty(),
        check('nombre',"El rol es obligatorio").not().isEmpty(),
        check('correo',"El rol es obligatorio").not().isEmpty(),
        check('rol').custom( esRoleValido ),
        validarCampos
],
usuariosPut);

router.post('/',
[
        check('correo', 'correo no es valido' ).isEmail(),
        check('correo' ).custom(emailExiste),
        check('nombre', 'Nombre es necesario' ).not().isEmpty(),
        check('password', 'La contraseña debe de tener 6 letras como minimo').isLength({ min:6 }),
        check('img', 'La imagen es requerida').not().isEmpty(),
        // check('rol', 'No es un rol valido' ).isIn( ["ADMI_ROLE","USER_ROLE"] ),
        check('rol').custom( esRoleValido ),
        validarCampos
],
usuariosPost);

router.delete('/:id',
[
        validarJWT,
        // esAdminRole,
        tieneRole('ADMIN_ROLE','VENTAS_ROLE'),
        check('id',"El id del usuario no es ID valido").isMongoId(),
        check('id').custom(existeUsuariPorId),
        validarCampos

],usuariosDelete );

router.patch('/', usuariosPath);



module.exports = router;