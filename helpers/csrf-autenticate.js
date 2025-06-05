import Tokens from 'csrf';
const tokens = new Tokens();

const csrfAutenticate = (req, res) => {
    const csrfSecret = req.session.csrfSecret;
    const tokenFromForm = req.body._csrf;

    if (!tokens.verify(csrfSecret, tokenFromForm)) {
        //* Mostrar mensaje de usuario no autenticado
        res.render('templates/mensaje', {
            pagina: 'Usuario no autenticado',
            mensaje: 'Hubo un problema al querer autenticar al usuario al mandar la información, intente nuevamente',
            error: true
        })
        return false
    } else {
        return true
    }
}

export {
    csrfAutenticate
}