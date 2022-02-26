const { Router } = require( 'express' );
const { check } = require('express-validator');
const { crearProducto, 
        obtnerProductos, 
        obtnerProducto, 
        actualizarProducto, 
        borrarProducto } = require('../controllers/productos');

const { 
        existeCategoria,
        estadoActivoProducto,
        existeProducto,
        existecategoriaConEstadoTrue,
        existeProductoporId } = require('../helpers/db-validators');
const { validarJWT, esAdminRole } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');


const router =Router();

// OBTENER TODAS LAS CATEGORIAS
router.get('/',obtnerProductos)

router.get('/:id',
[
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeProductoporId ),
    // check('id').custom( estadoActivoProducto ),
    validarCampos
]
, obtnerProducto )

// Crear Categoria cualquier - privado - token valido
router.post('/', 
[
    validarJWT,
    check('categoria',"El valor de categoria no es ID valido de mongo").isMongoId(),
    check('categoria').custom( existeCategoria ),
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    check( "precio","El precio es obligatorio" ).not().isEmpty(),
    check( "descripcion","El descripcion es obligatorio" ).not().isEmpty(),
    check( "idProducto","El idProducto es obligatorio" ).not().isEmpty(),
    check( "mac","La mac es obligatorio" ).not().isEmpty(),
    check( "activo","El activo del producto es obligatorio" ).not().isEmpty(),
    // check( "disponible","El disponible es obligatorio" ).not().isEmpty(),
    validarCampos
]
,crearProducto);


// actualizar privado cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeProducto ),
    check( "nombre","El nombre es obligatorio" ).not().isEmpty(),
    check( "precio","El precio es obligatorio" ).not().isEmpty(),
    check( "descripcion","El descripcion es obligatorio" ).not().isEmpty(),
    check( "idProducto","El idProducto es obligatorio" ).not().isEmpty(),
    check( "mac","La mac es obligatorio" ).not().isEmpty(),
    check( "activo","El activo del producto es obligatorio" ).not().isEmpty(),
    validarCampos
],actualizarProducto)


// BORRAR UNA CATEGORIA -ADMI
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id',"El id del producto no es ID valido").isMongoId() ,
    check('id').custom( existeCategoria ),
    // check('id').custom( estadoActivoCategoria ),
    validarCampos
], borrarProducto)




module.exports = router;