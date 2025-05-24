//const express = require('express'); //* CommonJS

import express from 'express' //* Sintaxis moderna de ECMAScript modules que es lo nativo de JavaScript
import usuarioRoutes from './routes/usuarioRoutes.js'

//* Crear la app
const app = express()

//* Routing
app.use('/', usuarioRoutes) //* el metodo use busca todas las rutas que inicien con una diagonal a diferencia de get que usa la ruta especifica.

//* Definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});