import Precio from '../models/Precio.js'
import Categoria from '../models/Categoria.js'

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
const formularioCrearPropiedad = async (req, res)=>{

    //* Consultar Modelo de Precio y Categoria
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])


    const errores = req.session.errores || [];
    req.session.errores = null;

    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        errores,
        barra: true,
        categorias,
        precios
    })
}

export{
    admin,
    formularioCrearPropiedad
}