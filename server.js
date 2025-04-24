const express = require("express");
const cors = require('cors'); // 💡 Lo subimos arriba
const bodyParser = require('body-parser');
const db = require("./app/config/databse.config");
const clientesRoutes = require("./app/routes/clientes");

const app = express();

// ✅ CORS debe ir primero
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.post('/clientes/pagos/webhook', bodyParser.raw({ type: 'application/json' }));

// Middlewares generales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⚠️ Webhook de Stripe necesita body crudo
app.use('/clientes/pagos/webhook', 
  bodyParser.raw({ type: 'application/json' }) // Solo en esta ruta
);

// Rutas
app.use("/clientes", clientesRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
db.sequelize.authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error("❌ Error al iniciar el servidor:", error));
