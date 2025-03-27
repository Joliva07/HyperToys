const express = require("express");
const db = require("./app/config/databse.config"); // Importas el objeto db
const clientesRoutes = require("./app/routes/clientes");

const app = express();
app.use(express.json());

// Importar rutas
app.use("/clientes", clientesRoutes);

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