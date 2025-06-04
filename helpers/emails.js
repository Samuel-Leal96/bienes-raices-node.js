import nodemailer from 'nodemailer'

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const { nombre, email, token} = datos

    //* Enviar email
    await transport.sendMail({
        from: 'Bienes raices SA de CV', //* Quien lo envia
        to: email, //* A quien se envia
        subject: 'Confirma tu cuenta en BienesRaices.com', //* Asunto del email,
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>

            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}"> Confirmar cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    const { nombre, email, token} = datos

    //* Enviar email
    await transport.sendMail({
        from: 'Bienes raices SA de CV', //* Quien lo envia
        to: email, //* A quien se envia
        subject: 'Restablece tu password en BienesRaices.com', //* Asunto del email,
        text: 'Restablece tu password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, se ha solicitado el restablecimiento de tu contraseña en BienesRaices.com</p>

            <p>Sigue el siguiente enlace para generar un password nuevo: 
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}"> Restablecer password</a></p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}