

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
const formularioCrearPropiedad = (req, res)=>{

    const errores = req.session.errores || [];
    req.session.errores = null;

    res.render('propiedades/crear',{
        pagina: 'Crear propiedad',
        errores,
        barra: true
    })
}

export{
    admin,
    formularioCrearPropiedad
}