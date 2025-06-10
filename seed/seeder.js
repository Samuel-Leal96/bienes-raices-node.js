import { exit } from 'node:process'
import categorias from './categorias.js'
import Categoria from '../models/Categoria.js'
import db from '../config/db.js'

const importarDatos = async () => {

    try {

        //* Autenticarte en la db o mejor dicho, genera la conexion
        await db.authenticate()
        
        //* Generar las columnas
        await db.sync()

        //* Insertat los datos
        await Categoria.bulkCreate(categorias)

        console.log('Datos importados correctamente');

        exit();

    }catch(error){
        console.log(error);
        exit(1); //* Terminamos todos los proceso corriendo en Node si es que hay un error
    }

}