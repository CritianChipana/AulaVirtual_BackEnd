const { Schema, model } = require( 'mongoose' );

const SolicitudSchema = Schema({

    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required :  true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required :  true
    },
    activo: {
        type: Boolean,
        default: false,
    },
    estado: {
        type: Boolean,
        default: true,
    },


})

module.exports = model( 'Solicitud', SolicitudSchema );
