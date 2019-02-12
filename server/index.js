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
mongoose.connect('mongodb://localhost:27017/app', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if(err) { 
        console.log('No se pudo conectar a la base de datos'.red) 
        return;
    }
    
    // Run Express Server
    app.listen(3000, (err) => {
        if(err) { 
            console.log('No se pudo iniciar el servidor'.red) 
            return;
        }

        console.log('Servidor iniciado correctamente en el puerto 3000'.green);
    });    
})
