import express from "express"
import { body } from 'express-validator'
import { admin, formCrearPropiedad, formGuardarPropiedad } from '../controllers/propiedadController.js'
const router = express.Router()

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', formCrearPropiedad);
router.post('/propiedades/crear',
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'), 
    formGuardarPropiedad);


export default router