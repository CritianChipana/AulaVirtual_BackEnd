const mongoose = require('mongoose');


const dbConnection = async()=>{

    try {

        const cn = await mongoose.connect( process.env.MONGO_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        if (cn) {

            console.log("base de datos online");
        } else {
            console.log('No se pudo conectar a la BD')
        }


        
    } catch (error) {
        console.log(error)

    }
    
};




module.exports = {
    dbConnection
}