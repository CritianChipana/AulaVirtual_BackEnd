const { response, request } = require( 'express' );
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generarJWT.JS');
const { googleVerify } = require('../helpers/google-verify');

const login = async ( req = request, res = response) =>{


    
    const { correo , password } = req.body;


    try {
        
        // Verificar si el correo existe
        const usuario = await Usuario.findOne( {correo} )

        if(  !usuario ){
            return   res.status(400).json({
                        msg:'Usuario / Password incorrectos - correo',
                        correo
                    })  
        }

        // Si el usuario esta Activo
        if(  !usuario.estado ){
            return   res.status(400).json({
                        msg:'Usuario / Password incorrectos - estado - false',
                        correo
                    })
        }

        //Verificar la contraseña

        const validPassword = bcryptjs.compareSync( password, usuario.password )
        if( !validPassword ){
            return   res.status(400).json({
                        msg:'Usuario / Password incorrectos - password',
                        correo
            })
        }


        // Generar el JWT
        const token = await generarJWT( usuario.id );

        return res.json({
            msg:'Login',
            correo,
            token,
            usuario
        })
        // id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxOWQxZTYxNDI5ZGQzZDNjYWVmMTI5YzBhYzJiYWU4YzZkNDZmYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTU5NjgyMDMwMTU2LWkxYTRmbGFtZ3Y3OG8xMDdndjN1ZnJmMnQ3b2tramZuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNTU5NjgyMDMwMTU2LWkxYTRmbGFtZ3Y3OG8xMDdndjN1ZnJmMnQ3b2tramZuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzNzE4Nzg3ODAyOTI1Njc2MjA4IiwiaGQiOiJ1bnRlbHMuZWR1LnBlIiwiZW1haWwiOiIyMDE3MjMwNDI4QHVudGVscy5lZHUucGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhDc2NpZjd0UkNvdlY0WUgwU1pMcWciLCJuYW1lIjoiQ1JJU1RJQU4gQUxFWElTIENISVBBTkEgSFVBTUFOIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqdU5aVUh4NVpCMjYwVzJSakNNVWtobDBoOHVVTXpRcUlfd2psST1zOTYtYyIsImdpdmVuX25hbWUiOiJDUklTVElBTiBBTEVYSVMiLCJmYW1pbHlfbmFtZSI6IkNISVBBTkEgSFVBTUFOIiwibG9jYWxlIjoiZXMiLCJpYXQiOjE2MzAwODUzMTEsImV4cCI6MTYzMDA4ODkxMSwianRpIjoiMmViN2Y5NTJlY2QzYTNhNjE1NjIzNDc2ODE1NGIzZThkZjk2MThiZiJ9.FfmjM8aZhPnQD4ThlSmfN3kDA2yS8J3nBkjpKfxz_AU9tTbVuapvRYfyIj5jWzTSDCM1DI0pcaQyvWuBNitQEGCD8eKfQ1a6Fsd89ibSK9zfZGnJ0FObeQ7DEaN7ADRjafeBdCGub6XbgF2NzzzaNCx35TW_vjnT3JE6mTqXA1_5xUgkA_3Lo5nAhBewRMVS8Wb0y2qaVGFpz6i4DUv0zGd3DJpCBDxT33C2PhGWB2vLYj7fUCXP0LBeayBZ4YtpbrbPXN7CZerRt2rxjHY6rUfgU63-iugLRSsu_FuR3HEQKQeT4-i1eoXh7GL_j0z_WJYGA04E8zQindslSfPE5g"


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el Admi'
        })
    }
}

const googleSignin = async ( req = request , res= response )=>{


    const { id_token } = req.body;

    try {

        const  {correo, nombre,img} = await googleVerify( id_token );

        console.log("8888888888888888888888888888888888888888888888888888888888888888")
        // console.log(googleUser);

        // Generar la referencia para saber si ya existe en la base de datos
        let usuario = await Usuario.findOne( { correo } );
        if( !usuario ){
            // Tengo que crearlo

            const data = {
                nombre,
                correo,
                password: ":p",
                img,
                google:true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // si el usuario en DB
        if( !usuario.estado ){
            return res.status(401).json({
                msg: "Hbale con el administrador, usuario bloqueado"
            });
        }
        let a = usuario.id;
        //Generar el JWT
        const token = await generarJWT( usuario.uid );

        return res.json({
            msg : 'Todo ok! , miau',
            id_token,
            // googleUser,
            token,
            usuario,
            a
        })


    } catch (error) {

        console.log(error);

        return res.status(400).json({

            msg : 'Token de Google no es valido',
            id_token
        });
        
    }


}

const RenovarJWT = async (req = request , res= response )=>{

    const usuario = req.usuario;


    try {

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            token,
            usuario
            
        })
        // id_token: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgxOWQxZTYxNDI5ZGQzZDNjYWVmMTI5YzBhYzJiYWU4YzZkNDZmYmMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiNTU5NjgyMDMwMTU2LWkxYTRmbGFtZ3Y3OG8xMDdndjN1ZnJmMnQ3b2tramZuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiNTU5NjgyMDMwMTU2LWkxYTRmbGFtZ3Y3OG8xMDdndjN1ZnJmMnQ3b2tramZuLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEzNzE4Nzg3ODAyOTI1Njc2MjA4IiwiaGQiOiJ1bnRlbHMuZWR1LnBlIiwiZW1haWwiOiIyMDE3MjMwNDI4QHVudGVscy5lZHUucGUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjhDc2NpZjd0UkNvdlY0WUgwU1pMcWciLCJuYW1lIjoiQ1JJU1RJQU4gQUxFWElTIENISVBBTkEgSFVBTUFOIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqdU5aVUh4NVpCMjYwVzJSakNNVWtobDBoOHVVTXpRcUlfd2psST1zOTYtYyIsImdpdmVuX25hbWUiOiJDUklTVElBTiBBTEVYSVMiLCJmYW1pbHlfbmFtZSI6IkNISVBBTkEgSFVBTUFOIiwibG9jYWxlIjoiZXMiLCJpYXQiOjE2MzAwODUzMTEsImV4cCI6MTYzMDA4ODkxMSwianRpIjoiMmViN2Y5NTJlY2QzYTNhNjE1NjIzNDc2ODE1NGIzZThkZjk2MThiZiJ9.FfmjM8aZhPnQD4ThlSmfN3kDA2yS8J3nBkjpKfxz_AU9tTbVuapvRYfyIj5jWzTSDCM1DI0pcaQyvWuBNitQEGCD8eKfQ1a6Fsd89ibSK9zfZGnJ0FObeQ7DEaN7ADRjafeBdCGub6XbgF2NzzzaNCx35TW_vjnT3JE6mTqXA1_5xUgkA_3Lo5nAhBewRMVS8Wb0y2qaVGFpz6i4DUv0zGd3DJpCBDxT33C2PhGWB2vLYj7fUCXP0LBeayBZ4YtpbrbPXN7CZerRt2rxjHY6rUfgU63-iugLRSsu_FuR3HEQKQeT4-i1eoXh7GL_j0z_WJYGA04E8zQindslSfPE5g"


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el Admi'
        })
    }



}



module.exports = {
      login,
      googleSignin,
      RenovarJWT
}