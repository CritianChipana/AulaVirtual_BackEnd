

/* 
{
    nombre:"holas",
    correo: "123456789",
    password: "caminar",
    img : '132321'
    rol: 'esta'
    estado : false or true,
    google : false or true
}
*/

const {  Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    correo: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        unique: true

    },
    password: {
        type: String,
        required: [true, "El nombre es obligatorio"],

    },
    img: {
        type : String
    },
    rol: {
        type: String,
        required: true,
        default:"USER_ROLE",
        emun: ['ADMIN_ROLE','USER_ROLE'] 
    },
    estado: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }

});

UsuarioSchema.methods.toJSON = function(){
    const {_id, __v, password, ...usuarioRestoInformacion } = this.toObject();
    usuarioRestoInformacion.uid = _id;
    return usuarioRestoInformacion;
}




module.exports = model( 'Usuario',UsuarioSchema );






