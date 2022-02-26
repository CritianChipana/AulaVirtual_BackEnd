
const { response, request } = require('express');
const { Role } = require('../models');

const obtenerRoles = async (req = request, res = response) => {

    const roles = await Role.find({estado:true});

    res.json({
        roles
    })
}

const obtenerRol = async (req = request, res = response) => {

    const _id = req.params.id;
    const rol = await Role.findOne({ _id });

    if (!rol) {
        return res.status(400).json({
            msg: "El id no es valido - sigue intentando estado false"
        })
    }

    res.json({
        rol
    })
}

const crearRol = async (req = request, res = response) => {

    const { rol } = req.body;

    const rolDB = await Role.findOne({ rol });

    if (rolDB) {
        return res.status(400).json({
            msg: " Ya existe rol - !rolBD "
        })
    }

    const data = {
        rol
    }

    const role = new Role(data);
    role.save();

    return res.status(200).json(role)
}

const actualizarRol = async (req = request, res = response) => {
    
    const id = req.params.id;
    
    // const { estado } = req.body;
    const rol = req.body.rol.toUpperCase();
    
    const rolID = await Role.findById(id)

    if( rolID.rol !== rol ){
        const rolDB = await Role.findOne({rol});

        if( rolDB ){
            return res.status(400).json({
                msg:`El rol ${rolDB.rol}, ya existe`,
              });
        }
    }

    const rolModificado = await Role.findByIdAndUpdate(
        id,
        {
            rol,
        },
        {
            new: true
        }
    )


    res.json({
        rolModificado
    });
}

const eliminarRol = async (req = request, res = response) => {

    const id = req.params.id;

    const rolEliminado = await Role.findByIdAndUpdate(
        id,
        {
            estado: false,
        },
        {
            new: true
        }
    )

    res.json({
        rolEliminado
    })
}

module.exports = {
    obtenerRoles,
    obtenerRol,
    crearRol,
    actualizarRol,
    eliminarRol,
}