//const express = require('express'); //* CommonJS

import express from 'express' //* Sintaxis moderna de ECMAScript modules que es lo nativo de JavaScript
import session from 'express-session';
import Tokens from 'csrf'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'

const tokens = new Tokens()

//* Crear la app
const app = express()

//* Middleware de sesión (antes de rutas)
app.use(session({
    secret: process.env.MI_SECRETO,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true solo si usas HTTPS
}));

//*Habilitar lectura de datos de formularios
app.use(express.urlencoded({ extended: true })) //* Permite que Express lea los datos enviados por formularios HTML y los deje disponibles en req.body.

//* Conexion a la base de datos
try {
    await db.authenticate();
    db.sync();
    console.log('Conexión correcta a la base de datos');
} catch (error) {
    console.log(error);
}

//* Habilitar PUG en express
app.set('view engine', 'pug') //* Asignamos el tipo de enginge template
app.set('views', './views') //* Declaramos la carpeta que tendra las vistas

//*Carpeta publica donde se encuentran los archivos CSS,imagenes y demas
app.use(express.static('public'))

//* Middleware para CSRF token (inyecta en cada respuesta)
app.use(async (req, res, next) => {
    if (!req.session.csrfSecret) {
        req.session.csrfSecret = await tokens.secret();
    }
    res.locals.csrfToken = tokens.create(req.session.csrfSecret); // Disponible en las vistas PUG
    // req.csrfToken = res.locals.csrfToken; // Disponible en controladores
    next();
});

//* Routing
app.use('/auth', usuarioRoutes) //* el metodo use busca todas las rutas que inicien con una diagonal a diferencia de get que usa la ruta especifica.

//* Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
});