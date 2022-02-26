const { response, request } = require( 'express' );

const bcryptjs = require('bcryptjs');
const { Categoria, Producto } =  require('../models');

// OBTENER CATEGORIAS
const obtnerProductos = async (req = request, res= response) => {

    // const { limit =5, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments( { estado : true }),
        
        Producto.find( { estado : true }).populate( "usuario",["_id" ] )
            .populate('categoria',["_id", "usuario"])
    ]);

    res.json({
        productos,
        total
    });
};

const obtnerProducto = async (req = request, res= response) => {

    const _id = req.params.id;


    const producto = await Producto.findOne(  { _id, estado : true } ); 

    if( !producto ){
        return  res.status(400).json({
            msg : "El id no es valido - sigue intentando estado false"
        })
    }
    

    res.json({
        producto,
    });
};

// CREAR Producto ******************************************************
const crearProducto = async (req, res =response) => {

    const {estado, usuario,  ...body } = req.body;
    const nombre = req.body.nombre.toUpperCase();

    const productoBD = await Producto.findOne( { nombre } );

    if( productoBD ){
        return res.status( 400 ).json({
            msg:" Ya existe producto - !productoBD "
        })
    }
    const validarestadocategoria = await Categoria.findById( body.categoria );

    if(!validarestadocategoria.estado){
        return res.status( 400 ).json({
            msg:"Verifique el estado de la categoria"
        })
    }

    const data = {
        nombre,
        ...body,
        usuario: req.usuario._id,
    }

    const producto = new Producto( data );
    producto.save();
    
    res.status( 201 ).json( producto );
    

}

// Actualizar Categoria
const actualizarProducto = async (req = request, res =response ) => {

    const id = req.params.id;
    const {precio, 
        descripcion, 
        disponible ,
        categoria, 
        img,
        idProducto,
        mac,
        activo
    } = req.body;

    const nombre = req.body.nombre.toUpperCase();

    const nombrebica = await Producto.findOne( { 
        nombre, 
        estado:true
    } )

    const validarestadocategoria = await Categoria.findById(categoria);
    if(!validarestadocategoria.estado){
        return res.status( 400 ).json({
            msg:"Verifique el estado de la categoria"
        })
    }

    // if( nombrebica ){89
    //     return res.status( 404).json({
    //         msg:"El producto ya existe - romel mmgvzo!!"
    //     });
    // }

    const productoID = await Producto.findById(id)

    if(productoID.nombre!==nombre){
        const productoDB = await Producto.findOne({ nombre });

      //  Si el producto existe
        if (productoDB) {
          return res.status(400).json({
            msg:`  La Producto ${productoDB.nombre}, ya existe, Romel mmgvzo!!`,
          });
        }
      }

    const productomodificado = await Producto.findByIdAndUpdate(
        id, 
        {
            nombre,
            precio,
            descripcion,
            disponible,
            img,
            idProducto,
            mac,
            activo
        },
        { new: true })

    console.log(productomodificado);

    res.json({
        productomodificado
    });
}

// Borrar Categoria
const borrarProducto = async (req, res) => {

    const { id } = req.params;
    
    const producto = await Producto.findByIdAndUpdate( id, { estado :false } , { new : true } )

    res.json({
        'ok':true,
        msg: 'DELETE API',
        id,
        producto,
        // categoriaAnterior
    })
}

module.exports = {
    obtnerProductos,
    obtnerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}