
const { response, request } = require( 'express' );
const jwt = require("jsonwebtoken");

const Usuario  =  require("./../models/usuario"); 


const validarJWT = async ( req = request, res = response,next )=>{

    const token = req.header( 'x-token' );

    if( !token ){
        return res.status( 401 ).json({
            msg:"No hay token en la peticion"
        })
    }


    try {
        
        const { uid }=jwt.verify(  token, process.env.SECRETKEY );

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById( uid );

        if ( !usuario ){
            res.status(401).json({
                msg:"Token no valido - Usuario no existe en BD"
            })
        }

        // Verificar si el uid tiene estados treue

        if( !usuario.estado ){
            res.status(401).json({
                msg:"Token no valido - Usuario con estado False"
            })
        }


        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg:"Error en el catch, token no valido"
        })
    }

    console.log('Se verifico el token');

   

}


module.exports = {
    validarJWT
}