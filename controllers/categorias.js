const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { Categoria } =  require('../models');

// obtnerCategorias -Paginado -total-populate

// obtnerCategoria -populate{}

// actualizarCategoria  - cambiar galleta

// borrarCategoria - estado false


// OBTENER CATEGORIAS
const obtnerCategorias = async (req = request, res= response) => {

    const { limit =5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments( { estado : true }),
        
        Categoria.find( { estado : true }).populate( "usuario", ["_id"] )
            .skip( Number( desde ) )  
            .limit( Number(  limit))
    ]);

    res.json({
        categorias,
        total
    });
};

const obtnerCategoria = async (req = request, res= response) => {

    const _id = req.params.id;


    const categoriaOlone = await Categoria.findOne(  { _id, estado : true } ); 

    if( !categoriaOlone ){
        return  res.status(400).json({
            msg : "El id no es valido - sigue intentando estado false"
        })
    }
    

    res.json({
        categoriaOlone,
        msg : "Holiotas" 
    });
};

// CREAR CATEGORIA
const crearCategoria = async (req, res =response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne( { nombre } );

    if( categoriaDB ){
        return res.status( 400 ).json({
            msg:" Ya existe categoria - !categoria "
        })
    }

    // Generar ña data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    console.log(data);

    const categoria = new Categoria( data );

    categoria.save();
    
    res.status( 201 ).json( categoria );
    

}

// Actualizar Categoria
const actualizarCategoria = async (req = request, res =response ) => {

    const id = req.params.id;
    const nombre = req.body.nombre.toUpperCase();

    const nombrebica = await Categoria.findOne( { nombre, estado:true } )

    if( nombrebica ){
        return res.status( 404).json({
            msg:"El nombre se repite - romel mmgvzo!!"
        });
    }


    const categoria = await Categoria.findByIdAndUpdate( id, {nombre}, { new: true })

    console.log(categoria);

    if( !categoria.estado ){
        return res.status( 404).json({
            msg:"El estado es false- dedicate a otra cosa"
        });
    }

    res.json({
        categoria
    });
}


// Borrar Categoria
const borrarCategoria = async (req, res) => {

    const { id } = req.params;
    
    const categoria = await Categoria.findByIdAndUpdate( id, { estado :false } , { new : true } )

    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        categoria,
        // categoriaAnterior
    })
}

module.exports = {
    obtnerCategorias,
    obtnerCategoria,
    actualizarCategoria,
    crearCategoria,
    borrarCategoria
}