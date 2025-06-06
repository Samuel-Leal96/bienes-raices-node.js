import express from "express"
import { admin, formularioCrearPropiedad } from '../controllers/propiedadController.js'
const router = express.Router()

router.get('/mis-propiedades', admin);
router.get('/propiedades/crear', formularioCrearPropiedad);


export default router