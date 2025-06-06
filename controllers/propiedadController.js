

const admin = (req, res) => {
    const errores = req.session.errores || [];
    req.session.errores = null;
    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        errores,
        barra: true
    })
}

export{
    admin
}