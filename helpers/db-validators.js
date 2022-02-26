const Usuario = require("../models/usuario");
const { Categoria, Role , Producto,Solicitud } = require ("./../models");


const esRoleValido =async (rol='') => {
    const existeRol = await Role.findOne({rol});
    if( !existeRol ){
            throw new Error(`El rol ${rol}  no esta registrado `)
    }

}

const emailExiste = async ( correo = '' ) =>{

    // Verificar si el correo Existe
    const existeEmail = await Usuario.findOne( { correo } );
    if( existeEmail ){
        throw new Error(`El correo ${correo}  ya existe!! `)
    
    }
}


const existeUsuariPorId = async ( id = '' ) =>{

    // Verificar si el correo Existe
    const existeUsuario = await Usuario.findById( id );
    if( !existeUsuario ){
       throw new Error(`El id ${id}, existe!! `)
      
    }
}

// Se parece a esta
const existeCategoria = async ( id = '' ) =>{

    // Verificar si el correo Existe
    const existeCategoria1 = await Categoria.findById( id );
    if( !existeCategoria1 ){
       throw new Error(`El id ${id} de categoria no existe!! `)
      
    }
}

const estadoActivoCategoria = async ( id = '' ) =>{

    const activadoCategoria  =await Categoria.findById( id );
    if( !activadoCategoria.estado ){
        throw new Error(`El estado es false, no existe!! `)
    }

}

const estadoActivoProducto = async ( id = '' ) =>{

    const activoProducto  =await Producto.findById( id );
    if( !activoProducto.estado ){
        throw new Error(`El estado es false, no existe!! `)
    }

}

const existecategoriaConEstadoTrue = async ( id = '' ) =>{

    // Verificar si el nombre existe Existe
    const existecategoria = await Categoria.findById( id );
    if( existecategoria ){
       throw new Error(`El id ${ id }, existe!! -  El id de esa categoria esta en false`)
    }
}

const existeProducto = async ( id = '' ) =>{

    // Verificar si el nombre existe Existe
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
       throw new Error(`El id producto-> ${ id }, no existe en db`)
    }
}
const existeProductoporId = async ( id = '' ) =>{

    // Verificar si el nombre existe Existe
    const existeProducto = await Producto.findById( id );
    if( !existeProducto ){
       throw new Error(`El id producto-> ${ id }, o eexiste en db`)
    }
}

/**
 * validar coleciones permitidas
 */

const coleccionesPermitidas = ( coleccion = '', colecciones = [] )=>{

    const incluida = colecciones.includes( coleccion );

    if( !incluida ){
        throw new Error( `La coleccion ${coleccion} no es permitida -${colecciones}` )
    }

    return true;

}

const existeRolporID = async (id='')=>{

    const existeRol = await Role.findById(id);
    if( !existeRol ){
        throw new Error(`El id producto-> ${ id }, o eexiste en db`)
     }

}

const existeSolicitudporID = async (id='')=>{

    const existeRol = await Solicitud.findById(id);
    if( !existeRol ){
        throw new Error(`El id producto-> ${ id }, o existe en db`)
     }

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuariPorId,
    existeCategoria,
    estadoActivoCategoria,
    estadoActivoProducto,
    existeProducto,
    existecategoriaConEstadoTrue,
    existeProductoporId,
    coleccionesPermitidas,
    existeRolporID,
    existeSolicitudporID
}
