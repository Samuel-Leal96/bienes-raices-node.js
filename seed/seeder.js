import { exit } from 'node:process'
import categorias from './categorias.js'
import precios from './precios.js'
import { Categoria, Precio } from '../models/index.js'
import db from '../config/db.js'

const importarDatos = async () => {

    try {

        //* Autenticarte en la db o mejor dicho, genera la conexion
        await db.authenticate()
        
        //* Generar las columnas
        await db.sync()

        //* Insertat los datos con dos awaits cuando uno depende del otro y los queremos ejecutar de forma independiente
        // await Categoria.bulkCreate(categorias)
        // await Precio.bulkCreate(precios)

        //* Utilizamos promise all cuando un await no depende de otro y queremos que se ejecuten en paralelo osea al mismo tiempo
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ])

        console.log('Datos importados correctamente');

        exit();

    }catch(error){
        console.log(error);
        exit(1); //* Terminamos todos los proceso corriendo en Node si es que hay un error
    }
}

const eliminarDatos = async ()=> {
    try {
        // await Promise.all([
        //     //* Ponemos truncate para que tambien elimine los espacios ocupados por los id.
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ])

        await db.sync({ force: true });
        console.log('Datos eliminados correctamente');
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

//* Utilizamos argv para preguntar si en los argumentos del comando de la terminal viene -i entonces llamamos a importar datos
//* Example: node ./seed/seeder.js -i, la primera posicion es node, la segunda es ./seed/seeder.js y -i es la tercera
//* process quiere decir que es un proceso y lo ponemos porque estamos haciendo un script con node
if(process.argv[2] === '-i'){
    importarDatos();
}

if(process.argv[2] === '-e'){
    eliminarDatos();
}