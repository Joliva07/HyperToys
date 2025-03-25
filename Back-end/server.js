const db = require('./app/config/databse.config');

async function startServer() {
    try {
        console.log('Intentando conectar a la base de datos...');
        await db.sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        // Aquí puedes iniciar tu servidor, por ejemplo, con Express
        // const express = require('express');
        // const app = express();
        // app.listen(3000, () => {
        //     console.log('Servidor escuchando en el puerto 3000');
        // });
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
}

startServer();