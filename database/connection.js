const mongoose = require('mongoose');


const dbConnection = async()=>{

    try {

        await mongoose.connect( process.env.MONGO_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log("base de datos online");

        
    } catch (error) {
        console.log(error)

    }
    
};




module.exports = {
    dbConnection
}