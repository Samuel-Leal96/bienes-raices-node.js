import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'
import bcrypt from 'bcrypt'
import { csrfAutenticate } from '../helpers/csrf-autenticate.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar sesión'
    })
}

const autenticar = async (req, res) => {

    await check('email').isEmail().withMessage('El email es obligatorio').run(req);
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req);

    let resultado = validationResult(req); //* Me da el resultado de la validación 

    if (!resultado.isEmpty()) { //* Quiere decir que hay inputs que no pasaron la validación
        return res.render('auth/login', {
            pagina: 'Iniciar sesión',
            errores: resultado.array()
        })
    }

    const autenticate = csrfAutenticate(req, res)

    if (!autenticate) {
        return
    }

    console.log('Autenticando...');
}

const formularioRegistro = async (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta',
    })
}

const registrar = async (req, res) => {

    //*Validacion por cada input
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req);
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req); //* Me da el resultado de la validación 

    if (!resultado.isEmpty()) { //* Quiere decir que hay inputs que no pasaron la validación
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    const autenticate = csrfAutenticate(req, res)

    if (!autenticate) {
        return
    }

    //* Extraemos la información con desestructuración 
    const { nombre, email, password } = req.body

    //* Verificar que el usuario no este duplicado
    const existeUsuario = await Usuario.findOne({ where: { email } })

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre,
                email
            }
        })
    }

    //* Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //* Envia email de confirmación 
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    //* Mostrar mensaje de confirmación de creacion de usuario
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace'
    })

    return
}

//* Funcion que comprueba una cuenta
const confirmar = async (req, res, next) => {

    const { token } = req.params

    //* Verificar si el token es valido
    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intentelo mas tarde',
            error: true
        })
    }

    //* Confirmar la cuenta

    usuario.token = null;
    usuario.confirmado = true;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta confirmada',
        mensaje: 'La cuenta se confirmo correctamente'
    })


}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso'
    })
}

const resetPassword = async (req, res) => {
    //*Validacion del email
    await check('email').isEmail().withMessage('Eso no parece un email').run(req);

    let resultado = validationResult(req); //* Me da el resultado de la validación 

    if (!resultado.isEmpty()) { //* Quiere decir que hay inputs que no pasaron la validación
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso',
            errores: resultado.array()
        })
    }

    //* Buscar usuario
    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso',
            errores: [{ msg: 'Email no registrado con algun usuario' }]
        })
    }

    //* Generar un token y enviar el email
    usuario.token = generarId();

    await usuario.save();

    //*Enviar un email
    emailOlvidePassword({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token

    })

    //* Renderizar mensaje
    res.render('templates/mensaje', {
        pagina: 'Restablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones para recuperar tu password, presiona en el enlace'
    })

}

const comprobarToken = async (req, res) => {

    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Restablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    //* Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Restablece tu password',
    })
}

const nuevoPassword = async (req, res) => {

    const autenticate = csrfAutenticate(req, res)

    if (!autenticate) {
        return
    }

    //* Validar el password
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Los password no son iguales').run(req);

    let resultado = validationResult(req); //* Me da el resultado de la validación 

    if (!resultado.isEmpty()) { //* Quiere decir que hay inputs que no pasaron la validación
        return res.render('auth/reset-password', {
            pagina: 'Restablece tu password',
            errores: resultado.array()
        })
    }

    const { token } = req.params;
    const { password } = req.body;

    //* Identificar quien hace el password
    const usuario = await Usuario.findOne({ where: { token } });

    //* Hashear el nuevo password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Contraseña restablecida',
        mensaje: 'La contraseña se guardo correctamente'
    })

}


export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}