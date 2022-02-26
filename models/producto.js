
const { Schema, model } = require( 'mongoose' );


const ProductoSchema = Schema({

    nombre:{
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique :  true
    },
    estado:{
        type: Boolean,
        default: true,
        required : true
    },
    usuario : {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required :  true
    },
    precio : {
        type: Number,
        default: 0
    },
    categoria : {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required :  true
    },
    descripcion :{ type: String },
    disponible:{type: Boolean, default: true},
    img:{ type: String },
    idProducto:{
        type: String,
        require: [true, "El idProducto es obligatorio"],
    },
    mac:{
        type: String,
        require: [true, "La mac es obligatorio"],
    },
    activo:{
        type: Boolean,
        default: true,
        required : [true, "El activo del producto es obligatorio"],
    },

});

ProductoSchema.methods.toJSON = function(){
    const {__v,estado,...data } = this.toObject();
   
    return data;
}


module.exports = model( 'Producto', ProductoSchema );

