const express = require("express");
const db = require("./app/config/databse.config"); // Importas el objeto db
const app = express();
//  const Routes = require("./app/routes/router");
app.use(express.json());

 const router = require("./app/routes/route"); // Asegúrate de que la ruta sea correcta

 // Aplicar el prefijo /api a todas las rutas
 app.use('/api', router);
 
 // Ruta de prueba para verificar que el servidor está funcionando
 app.get('/', (req, res) => {
   res.send('Servidor funcionando');
 });

 app.use(express.json());

// Iniciar servidor
const PORT = process.env.PORT || 3000;

// Usa db.sequelize en lugar de sequelize directamente
db.sequelize.authenticate()
    .then(() => {
        console.log("Conectado a la base de datos");
        return db.sequelize.sync(); // Sincroniza modelos si es necesario
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(error => console.error("Error conectando a la BD:", error));