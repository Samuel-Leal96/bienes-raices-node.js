import { validationResult } from 'express-validator'
import {Precio, Categoria, Propiedad} from '../models/index.js'
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

//* Render de formulario para crear una nueva propiedad
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

//* Funcion POST para guardar la propiedad
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

    //* Guardar la propiedad en la DB

    const { titulo, descripcion, habitaciones, estacionamiento, banio, calle, lat, lng, precio: precioId, categoria: categoriaId} = req.body

    try {
        
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            banio,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

    } catch (error) {
        console.log(error);
    }


}

export {
    admin,
    formCrearPropiedad,
    formGuardarPropiedad
}