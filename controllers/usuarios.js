const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT.JS');

const Usuario =  require('../models/usuario');


const usuariosGet = async (req = request, res= response) => {


    // const {q, nombre = "no ingreso nombre", apikey} = req.query;

    const { limit =5, desde = 0 } = req.query;
    /*  const usuario = await Usuario.find( { estado : true } )
        .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
        .limit( Number(  limit));
    const total = await Usuario.countDocuments( { estado : true } ); */


//Esto es una consulta mas rapida
    const [total, usuario] = await Promise.all([
        Usuario.countDocuments( { estado : true }),
        Usuario.find( { estado : true })
            .skip( Number( desde ) )  // podemos validar desde donde, por cualquier error
            .limit( Number(  limit))
    ])

    res.json({
        usuario,
        total
    }
        
    );
};

const usuariosPut = async (req = request, res =response ) => {

    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO VALIDAR EN LA BD
    if( password ){
        // Emcriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto, { new: true })

    res.json({
        usuario
    });
}


const usuariosPost = async (req, res = response) => {

    try {

    const { nombre, apellido, correo, password, rol , img, grado, seccion} = req.body;
    const usuario = new Usuario( { nombre, apellido, correo, password, rol, img, grado, seccion } );

    // Emcriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt )

    //Guardar en BD
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.uid );

    res.json({
        success : true,
        token,
        usuario
    });

    } catch (error) {

        return res.status(500).json({
            success:false,
            msg:'Hable con el Admi'
        })
        
    }
}

const usuariosPath   =(req, res) => {
    res.json({
        success:true,
        msg: 'PATCH API'
    })
}



const usuariosDelete = async (req, res) => {

    const { id } = req.params;

    const uid = req.uid;
    // Fisicamente lo borra,ps
    // const usuario = await Usuario.findByIdAndDelete( id );
    
    const usuario = await Usuario.findByIdAndUpdate( id, { estado :false } , { new : true } )
    const userAntesDeEliminar = req.usuario;


    res.json({
        success:true,
        msg: 'DELETE API',
        id,
        usuario,
        userAntesDeEliminar
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPath,
    usuariosDelete
}

// PARA CREAR UN TAG
// git tag -a v0.0.2 -m "modulo 9 terminado"
// $ git push --tags

// PARA QUITAR EL SEGUIMIENTO DEL GIT
//git rm .env --cached
// *** agregar el archivo al gitignore , luego add, and commit


///VARIABLES PARA CONFIGURAR "HEROKU"
//  * heroku config  -> lista todas la variables de entorno
//  * heroku config:set nombreVariable = "variable"  -> Crear variable
//  * heroku config:get  -> listar las variables
//  * heroku config:unset  nombreVariale  -> eliminar varibale