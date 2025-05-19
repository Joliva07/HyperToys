const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./app/config/databse.config");
const clientesRoutes = require("./app/routes/router"); // Aquí tienes tus rutas actuales
const pagoController = require("./app/controllers/pago.controller"); // Añadimos controlador de pago

const app = express();

// ✅ Primero, configurar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://hypertoys-front.onrender.com");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Sin contenido para preflight
  }
  next();
});

// Ruta especial para el webhook de Stripe
// ✅ Ruta especial para Webhook de Stripe (solo esta usa body crudo)
app.post(
  '/HyperToys/pagos/webhook',
  bodyParser.raw({ type: 'application/json' }),
  pagoController.stripeWebhook
);

// Middlewares normales para el resto
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tus rutas normales
app.use("/HyperToys", clientesRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
db.sequelize.authenticate()
  .then(() => db.sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(error => console.error("Error conectando a la BD:", error));
