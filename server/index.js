require('./config');

const colors = require('colors');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


// Middlewares
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


// Define Routes
app.use(require('./routes'));


// Connect ot MongoDB
mongoose.connect(process.env.URI_DB, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if(err) { 
        console.log('No se pudo conectar a la base de datos'.red);
        return;
    }
    
    console.log('\nConectado correctamente a la DB'.green);
    
    // Run Express Server
    app.listen(process.env.PORT, (err) => {
        if(err) { 
            console.log('No se pudo iniciar el servidor'.red) 
            return;
        }

        console.log(`Servidor iniciado correctamente en el puerto ${process.env.PORT}`.green);
    });    
})
