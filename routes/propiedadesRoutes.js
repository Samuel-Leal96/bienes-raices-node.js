import express from "express"
import { body } from 'express-validator'
import { admin, formCrearPropiedad, formGuardarPropiedad } from '../controllers/propiedadController.js'
const router = express.Router()

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', formCrearPropiedad);

router.post('/propiedades/crear',
    body('titulo').notEmpty().withMessage('El titulo del anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripcion no puede ir vacía')
        .isLength({max: 200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('banio').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('banio').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),
    formGuardarPropiedad);


export default router