//const express = require('express'); //* CommonJS

import express from 'express' //* Sintaxis moderna de ECMAScript modules que es lo nativo de JavaScript
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

//* Crear la app
const app = express()

//* Conexion a la base de datos
try {
    await db.authenticate();
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.log(error);
}

//* Habilitar PUG en express
app.set('view engine', 'pug') //* Asignamos el tipo de enginge template
app.set('views', './views') //* Declaramos la carpeta que tendra las vistas

//*Carpeta publica donde se encuentran los archivos CSS,imagenes y demas
app.use( express.static('public') )

//* Routing
app.use('/auth', usuarioRoutes) //* el metodo use busca todas las rutas que inicien con una diagonal a diferencia de get que usa la ruta especifica.

//* Definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port, ()=>{
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});