import {check, validationResult} from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar sesión'
    })
}

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
    })
}

const registrar = async(req, res) => {

    //*Validacion por cada input
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({min: 6}).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals('password').withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req);

    res.json(resultado.array());

    const usuario = await Usuario.create(req.body)

    res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso'
    })
}


export{
    formularioLogin,
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}