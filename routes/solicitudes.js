const Router = require("express");

const { check } = require('express-validator');

const { 
    obtenerSolicitudes, 
    obtenerSolicitudById, 
    crearSolicitud, 
    actualizarSolicitud, 
    borrarSolicitud, 
    activarSolicitud
} = require("../controllers/solicitudes");
const { 
    existeSolicitudporID, 
    existeProductoporId, 
    existeUsuariPorId 
} = require("../helpers/db-validators");
const { 
    validarCampos, 
    validarJWT, 
    esAdminRole 
} = require("../middlewares");

const router = Router()



router.get("/", obtenerSolicitudes  )

router.get("/:id",
[
    check('id',"El id de la solicitud no es ID valido").isMongoId(),
    check('id').custom( existeSolicitudporID ),
    validarCampos
]
, obtenerSolicitudById   )

router.post("/",
[
    validarJWT,
    check('producto',"El id del producto no es ID valido").isMongoId(),
    check('producto').custom( existeProductoporId ),
    check('usuario',"El id del usuario no es valido no es ID valido").isMongoId(),
    check('usuario').custom( existeUsuariPorId ),

    validarCampos
]
, crearSolicitud  )

router.put("/:id",
[
    validarJWT,
    check('id',"El id de la solicitud no es ID valido").isMongoId(),
    check('id').custom( existeSolicitudporID ),
    check('producto',"El id del producto no es ID valido").isMongoId(),
    check('producto').custom( existeProductoporId ),
    check('usuario',"El id del usuario no es valido no es ID valido").isMongoId(),
    check('usuario').custom( existeUsuariPorId ),

    validarCampos
]
, actualizarSolicitud  )


router.delete("/:id",
[
    validarJWT,
    esAdminRole,
    check('id',"El id de la solicitud no es ID valido").isMongoId(),
    check('id').custom( existeSolicitudporID ),

    validarCampos
]
, borrarSolicitud  )

router.put("/activar/:id",
[
    validarJWT,
    esAdminRole,
    check('id',"El id de la solicitud no es ID valido").isMongoId(),
    check('id').custom( existeSolicitudporID ),

    validarCampos
]
, activarSolicitud  )




module.exports= router;