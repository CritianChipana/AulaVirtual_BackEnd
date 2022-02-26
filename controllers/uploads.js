const { response, request } = require("express");
const path = require('path');
const fs = require('fs');

var cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { Producto , Usuario } = require('../models')
const { subirArchivo } = require("../helpers/subir.archivo");

const cargarArchivo = async (req = request,res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
      res.status(400).send('No hay archivos subidos.');
      return;
    }

    try {
        const pathCompleto = await subirArchivo(req.files, ['txt','md','pdf'],'textos');
      
        return res.json({
            path : pathCompleto
        })
        
    } catch (error) {
        res.status(400).json({
            error
        })
    }
}

const actualizarImagen = async ( req = Request, res= response )=>{

    const { coleccion,id } = req.params;


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).send('No hay archivos subidos.');
        return;
    }

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id- '+ id 
                })
            }
            break;

        case 'productos':

            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un produccion con este id - '+ id 
                })
            }
            break;
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'});
    }
    // limpiar imagenes previas

    if( modelo.img ){
        // hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads' , coleccion, modelo.img);

        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync(  pathImagen)
        }
    }

    try {
        
    } catch (error) {
        
    }

    const nombre = await subirArchivo( req.files ,undefined , coleccion );
    modelo.img = nombre;

    await modelo.save();




    res.json({
        msg:"unod",
        coleccion,
        id,
        modelo
    })
}


const actualizarImagenCloudinary = async ( req = Request, res= response )=>{

    const { coleccion,id } = req.params;


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        res.status(400).send('No hay archivos subidos.');
        return;
    }

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id- '+ id 
                })
            }
            break;

        case 'productos':

            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un produccion con este id - '+ id 
                })
            }
            break;
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'});
    }
    // limpiar imagenes previas

    if( modelo.img ){
      // Borrar la img de cloudinary
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.')
        await cloudinary.uploader.destroy( public_id );
    }

    const { tempFilePath }  = req.files.archivo

    const {secure_url } = await cloudinary.uploader.upload( tempFilePath );
    modelo.img = secure_url;


    await modelo.save();

    res.json(modelo)
}


const mostrarImagen = async ( req= Request, res = response )=>{


    const { coleccion,id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id- '+ id 
                })
            }
            break;

        case 'productos':

            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un produccion con este id - '+ id 
                })
            }
            break;
        default:
            return res.status(500).json({msg:'Se me olvido validar esto'});
    }
    // limpiar imagenes previas

    if( modelo.img ){
        // hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads' , coleccion, modelo.img);

        if( fs.existsSync( pathImagen ) ){

            return res.sendFile( pathImagen )
        }
    }

    const pathImagen2 = path.join( __dirname, '../assets/plasholder.jpg' );

    res.sendFile( pathImagen2 )
}


module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}