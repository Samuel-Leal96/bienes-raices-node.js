import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({path: '.env'})

const db = new Sequelize(
    process.env.BD_NOMBRE, 
    process.env.BD_USER, 
    process.env.BD_PASS ?? '', {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql', //* Tipo de gestor de base de datos
    define: {
        timestamps: true //* Cuando un usuario se registre se crean dos columnas nuevas(registerDate,updateDate)
    },
    pool:{ //* Configura como va a ser el comportamiento para conexiones nuevas o existentes.
        max:5, //* Maximo de conexiones que realiza la misma persona al sitio
        min:0, //* Minimo de conexiones que realiza la misma persona al sitio y si es 0 libera recursos cuando no hay actividad en el sitio
        acquire: 3000, //* 30 segundos, tiempo que va a tratar de realizar la consulta antes de marcar error
        idle: 10000 //* 10 segundos despues de que no hay consultas, la conexion se finaliza para liberar memoria.
    }
});

export default db;