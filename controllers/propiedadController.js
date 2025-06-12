import { validationResult } from 'express-validator'
import Precio from '../models/Precio.js'
import Categoria from '../models/Categoria.js'
import { csrfAutenticate } from '../helpers/csrf-autenticate.js'

const admin = (req, res) => {
    const errores = req.session.errores || [];
    req.session.errores = null;
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        errores,
        barra: true
    })
}

//* Formulario para crear una nueva propiedad
const formCrearPropiedad = async (req, res) => {

    //* Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    //* Obtenemos los errores
    const errores = req.session.errores || [];
    req.session.errores = null;

    //* Obtenemos los datos previamente introducidos por el usuario
    const datos = req.session.datosForm || {}
    req.session.datosForm = null;

    res.render('propiedades/crear', {
        pagina: 'Crear propiedad',
        errores,
        barra: true,
        categorias,
        precios,
        datos
    })
}

const formGuardarPropiedad = async (req, res) => {

    //* Validación
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {

        //* Consultar Modelo de Precio y Categoria
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        req.session.errores = resultado.array();
        req.session.datosForm = req.body;
        req.session.categorias = categorias;
        req.session.precios = precios;

        return res.redirect('/propiedades/crear')

        // return res.render('propiedades/crear', {
        //     pagina: 'Crear propiedad',
        //     barra: true,
        //     categorias,
        //     precios,
        //     errores: resultado.array()
        // })
    }

    //* Validar el token del form de CSRF
    const autenticate = csrfAutenticate(req, res);

    if (!autenticate) {
        return;
    }

}

export {
    admin,
    formCrearPropiedad,
    formGuardarPropiedad
}