
const { response, request } = require('express');
const {  Producto, Usuario, Solicitud } = require('../models');

const obtenerSolicitudes = async (req = request, res = response) => {

    const [solicitudes] = await Promise.all([
        Solicitud.find({ estado: true }).populate("usuario")
            .populate('producto')
    ]);

    res.json({
        solicitudes
    })
}

const obtenerSolicitudById = async (req = request, res = response) => {

    const _id = req.params.id;

    const solicitud = await Solicitud.findOne({ _id, estado: true });

    if (!solicitud) {
        return res.status(400).json({
            msg: "El id de la solicitud no es valida - sigue intentando estado, este backend Es duro :v"
        })
    }

    return res.json({
        solicitud
    })
}

const crearSolicitud = async (req = request, res = response) => {


    const validarEstadoUsuario = await Usuario.findById(req.body.usuario);

    if (!validarEstadoUsuario.estado) {
        return res.status(400).json({
            msg: "Verifique el estado de la usuario"
        })
    }

    const validarEstadoProducto = await Producto.findById(req.body.producto);

    if (!validarEstadoProducto.estado) {
        return res.status(400).json({
            msg: "Verifique el estado de la producto"
        })
    }

    const data = {
        usuario: req.body.usuario,
        producto: req.body.producto,
    }

    const solicitud = new Solicitud(data);
    solicitud.save();

    res.status(201).json(solicitud);

}

const actualizarSolicitud = async (req = request, res = response) => {

    const id = req.params.id;

    const {
        usuario,
        producto,
    } = req.body;

    const validarEstadoUsuario = await Usuario.findById(req.body.usuario);

    if (!validarEstadoUsuario.estado) {
        return res.status(400).json({
            msg: "Verifique el estado de la usuario"
        })
    }

    const validarEstadoProducto = await Producto.findById(req.body.producto);

    if (!validarEstadoProducto.estado) {
        return res.status(400).json({
            msg: "Verifique el estado de la producto"
        })
    }

    const solicitudModificada = await Solicitud.findByIdAndUpdate(
        id,
        {
            usuario,
            producto,
        },
        { new: true })


    res.json({
        ok : true,
        solicitudModificada
    })
}


const borrarSolicitud = async (req = request, res = response) => {

    const id = req.params.id;
    
    const solicitud = await Solicitud.findByIdAndUpdate( id, { estado :false } , { new : true } )

    res.json({
        ok:true,
        solicitud
    })
}


const activarSolicitud = async (req = request, res = response) => {

    const id = req.params.id;

    const activacion = await Solicitud.findByIdAndUpdate(
        id,
        {
            activo: true,
        },
        { new: true })


    res.json({
        activacion
    })
}



module.exports = {
    obtenerSolicitudes,
    obtenerSolicitudById,
    crearSolicitud,
    actualizarSolicitud,
    borrarSolicitud,
    activarSolicitud,
}