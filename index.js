//const express = require('express'); //* CommonJS

import express from 'express' //* Sintaxis moderna de ECMAScript modules que es lo nativo de JavaScript

//* Crear la app
const app = express()

//* Routing
app.get('/', function(req, res){
    res.send('Hola mundo en express');
})

app.get('/nosotros', function(req, res){
    res.send('Información de nosotros');
})


//* Definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});